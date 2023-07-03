import axios, { AxiosRequestConfig } from 'axios';
import { createStore, ActionContext } from 'vuex';
import user, { UserProps } from './user';
import templates, { TemplatesProps } from './templates';
import global, { GlobalStatus } from './global';
import editor, { EditorProps } from './editor';

export interface GlobalDataProps {
    user: UserProps;
    templates: TemplatesProps;
    editor: EditorProps;
    global: GlobalStatus;
  }

const store = createStore({
    modules: {
        user,
        templates,
        global,
        editor
    }
});

export default store;