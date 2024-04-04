import { mount, shallowMount } from "@vue/test-utils"
import Register from "@/components/pages/Register.vue"
import Vuetify from "vuetify";

describe('Register', () => {

    let vuetify;

    beforeEach(() => {
        vuetify = new Vuetify();
    });
    

    it ('has data', () => {
        const wrapper = mount(Register, { vuetify })
        expect(wrapper.text()).toContain('Register')
    })

    it ('has register button', async () => {
        const wrapper = mount(Register, { vuetify })
        const button = wrapper.find('#registerButton');
        button.trigger('click');
        await wrapper.vm.$nextTick()
        expect(button.attributes().disabled).toBeDefined();
    })

    it ('is register button disabled after click with no info', async () => {
        const wrapper = mount(Register, { vuetify })
        const button = wrapper.find('#registerButton');
        button.trigger('click');
        await wrapper.vm.$nextTick()
        expect(button.attributes().disabled).toBeDefined();
    })

    it('is username not red when it is not empty', async () => {
        // const wrapper = mount(Register, { vuetify });
        const initData = {
            username: 'unit-test-username',
          };
        const wrapper = mount(Register, { vuetify,
            data() {
                return { ...initData };
              }
        });
        const button = wrapper.find('#registerButton');
        button.trigger('click');
        await wrapper.vm.$nextTick();
        const usernameLabel = wrapper.find('[for="usernameInput"]');
        console.log(wrapper.find('[for="usernameInput"]').attributes());
        expect(usernameLabel.attributes().class).not.toContain('error--text');
        expect(button.attributes().disabled).toBeDefined();
    });


    it('successfully routing you to login page after clicking "Sign In"', async () => {
        const wrapper = mount(Register, { vuetify });
        global.window = { location: { pathname: null } };
        const button = wrapper.find("#goToLogin")
        button.trigger('click')
        await wrapper.vm.$nextTick();
        expect(global.window.location.pathname).toContain('/login');
    });

    it('labels active and register button is not disabled if all attributes filled', async () => {
        const initData = {
            firstName: 'unit-test-first', 
            lastName: 'unit-test-last', 
            username: 'unit-test-username',
            email: 'unittestemail@gmail.com', 
            password: 'unittestunittest26', 
            verify: 'unittestunittest26', 
            sex: 'Male', 
            fromDateMenu: '2002-03-03', 
            fromDateVal: '2002-03-03'
          };
        const wrapper = mount(Register, { vuetify,
            data() {
                return { ...initData };
              }
        });
        global.window = { location: { pathname: null } };
        // wrapper.setData({ firstName: 'unit-test-first', lastName: 'unit-test-last', username: 'unit-test-username',
        //     email: 'unittestemail@gmail.com', password: 'unittestunittest26', verify: 'unittestunittest26', sex: 'Male', fromDateMenu: '2002-03-03', fromDateVal: '2002-03-03'})
        const button = wrapper.find('#registerButton');
        button.trigger('click');
        await wrapper.vm.$nextTick();
        const firstNameInput = wrapper.find('[for="firstNameInput"]')
        const lasttNameInput = wrapper.find('[for="lastNameInput"]')
        const usernameInput = wrapper.find('[for="usernameInput"]')
        const emailInput = wrapper.find('[for="emailInput"]')
        const passwordInput = wrapper.find('[for="passwordInput"]')
        const verifyInput = wrapper.find('[for="verifyInput"]')
        const sexSelect = wrapper.find('[for="sexSelect"]')
        const dateMenu = wrapper.find('[for="dateMenu"]')

        expect(firstNameInput.attributes().class).not.toContain('error--text')
        expect(lasttNameInput.attributes().class).not.toContain('error--text')
        expect(usernameInput.attributes().class).not.toContain('error--text')
        expect(emailInput.attributes().class).not.toContain('error--text')
        expect(passwordInput.attributes().class).not.toContain('error--text')
        expect(verifyInput.attributes().class).not.toContain('error--text')
        expect(sexSelect.attributes().class).not.toContain('error--text')
        expect(dateMenu.attributes().class).not.toContain('error--text')
        expect(button.attributes().disabled).not.toBeDefined()

        expect(firstNameInput.attributes().class).toContain('v-label--active')
        expect(lasttNameInput.attributes().class).toContain('v-label--active')
        expect(usernameInput.attributes().class).toContain('v-label--active')
        expect(emailInput.attributes().class).toContain('v-label--active')
        expect(passwordInput.attributes().class).toContain('v-label--active')
        expect(verifyInput.attributes().class).toContain('v-label--active')
        expect(sexSelect.attributes().class).toContain('v-label--active')
        expect(dateMenu.attributes().class).toContain('v-label--active')

        // console.log(global.window.location.pathname)
        // console.log(firstNameInput.attributes())
        // console.log(lasttNameInput.attributes())
        // console.log(usernameInput.attributes())
        // console.log(emailInput.attributes())
        // console.log(passwordInput.attributes())
        // console.log(verifyInput.attributes())
        // console.log(sexSelect.attributes())
        // console.log(dateMenu.attributes())
        // console.log(button.attributes())
        // expect(global.window.location.pathname).toContain('/login');
    });



})