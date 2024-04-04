import { mount, shallowMount } from "@vue/test-utils"
import HelloWorld from "@/components/HelloWorld.vue";
import Vuetify from "vuetify";
import { post } from "axios"

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

var mock = new MockAdapter(axios);

mock.onPost("http://127.0.0.1:8000/api/token/refresh/").reply(200, {
    refresh: "asdasdasd",
    access: "asdasdasd"
});

mock.onGet('http://127.0.0.1:8000/api/courses/').reply(200, {
    data: [
        { "id": 1,
        "title": "Chemistry",
        "description": "Chemistry Description",
        "short_href": "/chemistry",
        "url_for_image": "www.example-chemistry.com",
        "long_description":  "It is looooong description for Chemistry"},
        { "id": 2,
        "title": "Math",
        "description": "Math Description",
        "short_href": "/math",
        "url_for_image": "www.example-math.com",
        "long_description":  "It is looooong description for Math"}
    ]
  });


  mock.onGet('http://127.0.0.1:8000/api/get_info_by_token/undefined').reply(200,
  {
    "date_of_birth": "2024-03-06",
    "email": "qqq@gmail.com",
    "first_name": "glepka",
    "is_active": true,
    "last_name": "chekm",
    "sex": "M",
    "user_id": 2,
    "username": "glebovski"
});

mock.onPost('http://127.0.0.1:8000/api/logout/').reply(200)

// jest.mock('axios', () => ({
//     post: jest.fn() 
//   }));

describe('Main', () => {

    const openProfileAndHideOthersMethod = jest.spyOn(HelloWorld.methods, 'openProfileAndHideOthers');
    const openDashboardAndHideOthersMethod = jest.spyOn(HelloWorld.methods, 'openDashboardAndHideOthers');
    const logoutMethod = jest.spyOn(HelloWorld.methods, 'logout');

    let vuetify;

    beforeEach(() => {
        vuetify = new Vuetify();
    });

    it ('has data', async () => {
        const $session = {
            start: jest.fn(),
            has: jest.fn(),
            get: jest.fn(),
            set: jest.fn()
        };

        const wrapper = mount(HelloWorld, {
            vuetify,
            mocks: {
                    $session
                }
        });

        expect(wrapper.text()).toContain('Chat')
        expect(wrapper.text()).toContain('Logout')
        expect(wrapper.text()).toContain('All Courses')
    })

    it ('is about href right', () => {
        const $session = {
            start: jest.fn(),
            has: jest.fn().mockReturnValue(true),
            // has: jest.fn(),
            get: jest.fn(),
            set: jest.fn()
        };

        const wrapper = shallowMount(HelloWorld, {
            vuetify,
            mocks: {
                    $session
                }
        });

        const button = wrapper.find("#aboutButton")
        expect(button.attributes().href).toContain('/about')
    })

    it ('is chat href right', () => {
        const $session = {
            start: jest.fn(),
            has: jest.fn().mockReturnValue(true),
            get: jest.fn(),
            set: jest.fn()
        };
        const wrapper = shallowMount(HelloWorld, {
            vuetify,
            mocks: {
                    $session
                }
        });

        const button = wrapper.find("#chatButton")
        expect(button.attributes().href).toContain('/websocket-chat')
    })

    it ('check profile method', async () => {

        const $session = {
            start: jest.fn(),
            has: jest.fn().mockReturnValue(true),
            get: jest.fn(),
            set: jest.fn()
        };
        const wrapper = mount(HelloWorld, {
            vuetify,
            mocks: {
                    $session
                }
        });

        const button = wrapper.find('#profileButton')
        button.trigger('click')
        expect(openProfileAndHideOthersMethod).toHaveBeenCalled();
        
    })

    it ('check courses method', async () => {

        const $session = {
            start: jest.fn(),
            has: jest.fn().mockReturnValue(true),
            get: jest.fn(),
            set: jest.fn()
        };
        const wrapper = mount(HelloWorld, {
            vuetify,
            mocks: {
                    $session
                }
        });

        const button = wrapper.find('#coursesButton')
        button.trigger('click')
        expect(openDashboardAndHideOthersMethod).toHaveBeenCalled();
        
    })

    it ('check logout method', async () => {

        const $session = {
            start: jest.fn(),
            has: jest.fn().mockReturnValue(true),
            get: jest.fn(),
            set: jest.fn()
        };
        const wrapper = mount(HelloWorld, {
            vuetify,
            mocks: {
                    $session
                }
        });

        const button = wrapper.find('#logoutButton')
        button.trigger('click')
        await wrapper.vm.$nextTick();
        expect(logoutMethod).toHaveBeenCalled();
        
    })

})
