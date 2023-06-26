import axios, { AxiosRequestConfig } from 'axios';
import { createStore, ActionContext } from 'vuex';
import user, { UserProps } from './user';
import templates, { TemplatesProps } from './templates';
import global, { GlobalStatus } from './global';

export interface GlobalDataProps {
    user: UserProps;
    templates: TemplatesProps;
    // editor: EditorProps;
    global: GlobalStatus;
  }

const store = createStore({
    modules: {
        user,
        templates,
        global
    }
});

export default store;