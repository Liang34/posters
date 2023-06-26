import axios, { AxiosRequestConfig } from 'axios';
import { createStore, ActionContext } from 'vuex';
import user, { UserProps } from './user';

export interface GlobalDataProps {
    user: UserProps;
    // templates: TemplatesProps;
    // editor: EditorProps;
    // global: GlobalStatus;
  }

const store = createStore({
    modules: {
        user
    }
});

export default store;