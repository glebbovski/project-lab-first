import { mount, shallowMount, createLocalVue } from "@vue/test-utils"
import Course from "@/components/pages/Course.vue";
import router from "@/router";
import Vuetify from "vuetify";

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);

mock.onPost("http://127.0.0.1:8000/api/token/refresh/").reply(200, {
    refresh: "about-refresh",
    access: "about-access"
});

const questions = [
    {
        id: 1,
        question: "What is creator name?",
        course: 1
    }
];

const answers = [
    {
        "id": 1,
        "answer": "Deniz",
        "isRight": false,
        "question": 1
    },
    {
        "id": 2,
        "answer": "Artem",
        "isRight": false,
        "question": 1
    },
    {
        "id": 3,
        "answer": "Hlib",
        "isRight": true,
        "question": 1
    }
];

mock.onGet("http://127.0.0.1:8000/api/questions/?course=1").reply(200, questions);
mock.onGet("http://127.0.0.1:8000/api/answers/?question=1").reply(200, answers);
mock.onGet("http://127.0.0.1:8000/api/previousresult/?course=1&user=[object Object]").reply(200);


describe('Course', () => { 

    let vuetify;

    beforeEach(() => {
        vuetify = new Vuetify();
    });

    it ('has data', async () => {
        const $session = {
            start: jest.fn(),
            has: jest.fn().mockReturnValue(true),
            get: jest.fn().mockReturnValue({
                id: 1,
                title: 'Course Title',
                description: 'Course Description',
                short_href: 'short_href',
                url_for_image: 'clava coca',
                long_description: 'Jest Long Description'
            }),
            set: jest.fn()
        };

        const wrapper = mount(Course, {
            vuetify,
            router,
            mocks: {
                $session
            },
        });
        expect(wrapper.text()).toContain('Jest Long Description')
        expect(wrapper.find('#submitButton').exists()).toBeTruthy()
        expect(wrapper.find('#retryButton').exists()).toBeTruthy()
    })


    it ('check that quiz is shown', async () => {
        const initData = {
            questions: [{
                id: 1,
                text: "What is creator name?",
                selectedOption: null,
                submitted: false,
                course: 1,
                options: [
                    {
                        id: 1,
                        text: "Deniz",
                        isCorrect: false
                    },
                    {
                        id: 2,
                        text: "Artem",
                        isCorrect: false
                    },
                    {
                        id: 3,
                        text: "Hlib",
                        isCorrect: true
                    }
                ]
            }]
          };


        const $session = {
            start: jest.fn(),
            has: jest.fn().mockReturnValue(true),
            get: jest.fn().mockReturnValue({
                id: 1,
                title: 'Course Title',
                description: 'Course Description',
                short_href: 'short_href',
                url_for_image: 'clava coca',
                long_description: 'Jest Long Description'
            }),
            set: jest.fn()
        };

        const wrapper = mount(Course, {
            vuetify,
            router,
            mocks: {
                $session
            },
            data() {
                return { ...initData };
            }
        });
        expect(wrapper.text()).toContain('Hlib')
        expect(wrapper.text()).toContain('Deniz')
        expect(wrapper.text()).toContain('Artem')
        expect(wrapper.text()).toContain('What is creator name?')
    })


})