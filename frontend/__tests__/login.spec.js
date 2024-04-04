import { mount, shallowMount } from "@vue/test-utils"
import Auth from "@/components/pages/Auth.vue";
import Vuetify from "vuetify";

var axios = require("axios");

describe('Login', () => {

    let vuetify;

    beforeEach(() => {
        vuetify = new Vuetify();
    });

    it ('has data', () => {
        const wrapper = mount(Auth, { vuetify });
        expect(wrapper.text()).toContain('Login')
        expect(wrapper.text()).toContain('Sign Up')
    })

    it ('shows password length', () => {
        const initData = {
            credentials: {password: 'unit-test-password'},
        };
        const wrapper = mount(Auth, { vuetify,           
            data() {
              return { ...initData };
            } 
        });
        expect(wrapper.text()).toContain('Login')
        expect(wrapper.text()).toContain('Sign Up')
        expect(wrapper.text()).toContain('18')
    })

    it ('is login button disabled after click with no info', async () => {
        const wrapper = mount(Auth, { vuetify })
        const button = wrapper.find('#loginButton');
        button.trigger('click');
        await wrapper.vm.$nextTick()
        expect(button.attributes().disabled).toBeDefined();
    })

    it('successfully routing to register page after clicking "Sign Up"', async () => {
        const wrapper = mount(Auth, { vuetify });
        global.window = { location: { pathname: null } };
        const button = wrapper.find("#registerButton")
        button.trigger('click')
        await wrapper.vm.$nextTick();
        console.log(global.window.location.pathname)
        expect(global.window.location.pathname).toContain('/register');
    });

    it('is password not red when it is not empty', async () => {
        const initData = {
            credentials: { password: 'unit-test-password'},
          };
        const wrapper = mount(Auth, { vuetify,
            data() {
                return { ...initData };
              }
        });
        const button = wrapper.find('#loginButton');
        button.trigger('click');
        await wrapper.vm.$nextTick();
        const passwordLabel = wrapper.find('[for="password"]');
        console.log(wrapper.find('[for="password"]').attributes());
        expect(passwordLabel.attributes().class).not.toContain('error--text');
        expect(button.attributes().disabled).toBeDefined();
    });


    it('labels active and login button is not disabled if all attributes filled', async () => {
        const initData = {
            credentials: {email: "unittest@gmail.com", password: "unitpassword26"}
          };
        const wrapper = mount(Auth, { vuetify,
            data() {
                return { ...initData };
              }
        });
        const button = wrapper.find('#loginButton');
        button.trigger('click');
        await wrapper.vm.$nextTick();
        const emailInput = wrapper.find('[for="email"]')
        const passwordInput = wrapper.find('[for="password"]')

        expect(emailInput.attributes().class).not.toContain('error--text')
        expect(passwordInput.attributes().class).not.toContain('error--text')

        expect(emailInput.attributes().class).toContain('v-label--active')
        expect(passwordInput.attributes().class).toContain('v-label--active')

    });
    
})