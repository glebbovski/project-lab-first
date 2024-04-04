import { mount, shallowMount, createLocalVue } from "@vue/test-utils"
import About from "@/components/pages/About.vue"
import router from "@/router";
import Vuetify from "vuetify";


var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);

mock.onPost("http://127.0.0.1:8000/api/token/refresh/").reply(200, {
    refresh: "about-refresh",
    access: "about-access"
});

mock.onGet("http://127.0.0.1:8000/api/about/").reply(200, 
{
    creator: 'Hlib Chekmezov',
    about_project: 'jest test project',
    born_city: 'Luhansk'
});


describe('About', () => { 

    let vuetify;

    beforeEach(() => {
        vuetify = new Vuetify();
    });

    it ('has data', async () => {

        let initData = {
            born_city: null,
            creator: null,
            about_project: null
        };

        const $session = {
            start: jest.fn(),
            has: jest.fn().mockReturnValue(true),
            get: jest.fn(),
            set: jest.fn()
        };

        const response = await axios.get("http://127.0.0.1:8000/api/about/")
        initData.born_city = response.data['born_city']
        initData.creator = response.data['creator']
        initData.about_project = response.data['about_project']

        const wrapper = mount(About, {
            vuetify,
            router,
            mocks: {
                    $session
            },
            data() {
                return { ...initData };
            }

        });
        expect(wrapper.text()).toContain('jest test project')
        expect(wrapper.text()).toContain('Hlib Chekmezov')
        expect(wrapper.text()).toContain('Luhansk')
    })

    it ('is back button href right', () => {
        const $session = {
            start: jest.fn(),
            has: jest.fn().mockReturnValue(true),
            get: jest.fn(),
            set: jest.fn()
        };
        const wrapper = shallowMount(About, {
            vuetify,
            mocks: {
                    $session
                }
        });

        const button = wrapper.find("#backButton")
        expect(button.attributes().to).toBe('/')
    })


})