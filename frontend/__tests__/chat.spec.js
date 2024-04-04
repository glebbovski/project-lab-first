import { mount, shallowMount } from "@vue/test-utils"
import ChatRoom from "@/components/pages/ChatRoom.vue";
import WS from "jest-websocket-mock"
import Vuetify from "vuetify";

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);

mock.onPost("http://127.0.0.1:8000/api/token/refresh/").reply(200, {
    refresh: "chatroon-refresh",
    access: "chatroom-access"
});

mock.onGet("http://127.0.0.1:8000/api/chatmessages/?room=chatroom").reply(200, 
{
    data: [
        {
            "id": 1,
            "room": "chatroom",
            "content": "qwe",
            "date_added": "2024-03-29T12:10:35.613447+02:00",
            "user": 2
        }
    ]
});


describe('Websocket Chat', () => {

    const submitMethod = jest.spyOn(ChatRoom.methods,'sendMessage');
    const closeSocketConnectionMethod = jest.spyOn(ChatRoom.methods,'closeSocketConnection');

    let vuetify;

    beforeAll(() => {
        document.getElementById = jest.fn().mockReturnValue({
          scrollHeight: 200
        });
      });

    beforeEach(() => {
        vuetify = new Vuetify();
    });

    it ('has data', () => {
        const $session = {
            start: jest.fn(),
            has: jest.fn(),
            get: jest.fn(),
            set: jest.fn()
        };

        const wrapper = mount(ChatRoom, {
            vuetify,
            mocks: {
                    $session
                }
        });
        expect(wrapper.text()).toContain('Back to Main Page')
        expect(wrapper.text()).toContain('Submit')
    })

    it ('shown username', async () => {
        const initData = {
            username: 'unit-test-username',
          };

        const $session = {
            start: jest.fn(),
            has: jest.fn(),
            get: jest.fn(),
            set: jest.fn()
        };

        const wrapper = mount(ChatRoom, { vuetify,
            mocks: {
                $session
            },
            data() {
                return { ...initData };
              }
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain('Your username: ' + initData.username)
    })

    it ('check submit button click', async() => {
        const jsdomAlert = window.alert;  // remember the jsdom alert
        window.alert = () => {}
        const $session = {
            start: jest.fn(),
            has: jest.fn().mockReturnValue(true),
            get: jest.fn(),
            set: jest.fn()
        };
        const wrapper = mount(ChatRoom, {
            vuetify,
            mocks: {
                    $session
                }
        });

        const button = wrapper.find('#submitButton')
        button.trigger('click')
        await wrapper.vm.$nextTick();
        expect(submitMethod).toHaveBeenCalled();
        window.alert = jsdomAlert;
    })

    it ('check back button', async () => {

        const initData = {
            chatSocket: new WebSocket("ws://localhost:1234"),
          };

        // const server = new WS("ws://localhost:1234");
        // const client = new WebSocket("ws://localhost:1234");


        const $session = {
            start: jest.fn(),
            has: jest.fn().mockReturnValue(true),
            get: jest.fn(),
            set: jest.fn()
        };


        const wrapper = mount(ChatRoom, {
            vuetify,
            mocks: {
                    $session
                },
            data() {
                    return { ...initData };
            }
        });

        const button = wrapper.find('#backButton')
        button.trigger('click')
        await wrapper.vm.$nextTick();
        expect(closeSocketConnectionMethod).toHaveBeenCalled();
    })

})