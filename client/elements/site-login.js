import buildShadowRoot from './buildShadowRoot.js';
import {loginUser} from '../utils/services.js';
// TODO: for now the needed script call is in the login and registration template.
class SiteLogin extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
        }
        .signin span {
          display: none;
        }
        .signin-container {
          display: flex;
          align-items: center;
        }
      </style>
      <section class="signin-container">
        <div class="signin">ciao</div>
        <span class="text">Sign in with google</span>
      </section>
      <slot></slot>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      signin: this.shadowRoot.querySelector('.signin')
    };
    this.auth = false;
    this.inited = false;
    if (stiva) {
      stiva.listen('auth-init', data => {
        this.auth = true;
        this.init();
      });
    }
  }

  handleSignin(e) {
    const token = e.getAuthResponse().id_token;
    if (this.noVerify) {
      const profile = e.getBasicProfile();
      const name = profile.getName();
      const img = profile.getImageUrl();
      const email = profile.getEmail();
      this.send(token, {name, img, email});
    } else {
      this.login(token);
    }
  }

  async login(token) {
    const user = await loginUser(token);
    window.location = '/';
  }

  send(token, profile) {
    this.dispatchEvent(
      new CustomEvent('auth', {
        detail: {token, profile}
      })
    );
  }

  async init() {
    if (!this.inited && this.clientID && this.auth) {
      const handler = this.handleSignin.bind(this);
      gapi.load('auth2', async () => {
        this.auth = await gapi.auth2.init({client_id: this.clientID});
        // this.auth.attachClickHandler(this.elems.signin, {scope: 'profile email'}, handler, handler);
      });
      gapi.signin2.render(this.elems.signin, {
        scope: 'email profile',
        width: 50,
        height: 50,
        longtitle: true,
        theme: 'dark',
        onsuccess: handler,
        onfailure: handler
      });
      this.inited = true;
    }
  }

  static get observedAttributes() {
    return ['client-id'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'client-id':
        this.init();
        break;
      default:
        break;
    }
  }

  get clientID() {
    return this.getAttribute('client-id');
  }
  set clientID(val) {
    if (val) {
      this.setAttribute('client-id', val);
    } else {
      this.removeAttribute('client-id');
    }
  }
  get noVerify() {
    return this.hasAttribute('no-verify');
  }
  set noVerify(val) {
    if (val) {
      this.setAttribute('no-verify', '');
    } else {
      this.removeAttribute('no-verify');
    }
  }
}

customElements.define('site-login', SiteLogin);
export default SiteLogin;
