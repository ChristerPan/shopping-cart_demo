// Mock dependencies
jest.mock('../controllers/index', () => ({
    userCtr: {
        getRegisterPage: jest.fn(),
        getLoginPage: jest.fn(),
        getProfilePage: jest.fn(),
        register: jest.fn(),
        login: jest.fn(),
        logout: jest.fn(),
        googleLogin: jest.fn(),
        googleCallBack: jest.fn(),
    },
}));

const request = require('supertest');
const app = require("../index");
const { userCtr } = require('../controllers/index');


describe('User Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('GET /register should render register page', async () => {
        userCtr.getRegisterPage.mockImplementation((req, res) => res.sendStatus(200));

        const response = await request(app).get('/user/register');
        expect(response.statusCode).toBe(200);
        expect(userCtr.getRegisterPage).toHaveBeenCalled();
    });

    test('GET /login should render login page', async () => {
        userCtr.getLoginPage.mockImplementation((req, res) => res.sendStatus(200));

        const response = await request(app).get('/user/login');
        expect(response.statusCode).toBe(200);
        expect(userCtr.getLoginPage).toHaveBeenCalled();
    });

    test('GET /profile should render profile page if authenticated', async () => {
        userCtr.getProfilePage.mockImplementation((req, res) => res.sendStatus(200));

        const response = await request(app).get('/user/profile');
        expect(response.statusCode).toBe(200);
        expect(userCtr.getProfilePage).toHaveBeenCalled();
    });

    test('POST /register should create a new user', async () => {
        userCtr.register.mockImplementation((req, res) => res.sendStatus(201));

        const response = await request(app)
            .post('/user/register')
            .send({ username: 'testuser', password: 'testpass', confirmPassword: 'testpass' });
        expect(response.statusCode).toBe(201);
        expect(userCtr.register).toHaveBeenCalled();
    });

    test('POST /login should authenticate user', async () => {
        userCtr.login.mockImplementation((req, res) => res.sendStatus(200));

        const response = await request(app)
            .post('/user/login')
            .send({ username: 'testuser', password: 'testpass' });
        expect(response.statusCode).toBe(200);
        expect(userCtr.login).toHaveBeenCalled();
    });

    test('POST /logout should log out user', async () => {
        userCtr.logout.mockImplementation((req, res) => res.sendStatus(200));

        const response = await request(app).post('/user/logout');
        expect(response.statusCode).toBe(200);
        expect(userCtr.logout).toHaveBeenCalled();
    });

    test('GET /googleLogin should redirect to Google', async () => {
        userCtr.googleLogin.mockImplementation((req, res) => res.redirect('https://accounts.google.com'));

        const response = await request(app).get('/user/googleLogin');
        expect(response.statusCode).toBe(302); // Redirect status code
        expect(response.headers.location).toBe('https://accounts.google.com');
        expect(userCtr.googleLogin).toHaveBeenCalled();
    });

    test('GET /google/callback should handle Google callback', async () => {
        userCtr.googleCallBack.mockImplementation((req, res) => res.sendStatus(200));

        const response = await request(app).get('/user/google/callback');
        expect(response.statusCode).toBe(200);
        expect(userCtr.googleCallBack).toHaveBeenCalled();
    });
});