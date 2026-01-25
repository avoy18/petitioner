export interface StoryMeta {
    title: string;
    description?: string;
}

export interface Story<T = any> {
    (): JSX.Element;
    meta?: {
        title?: string;
        description?: string;
        args?: T;
    };
}

export interface ComponentStories {
    default: StoryMeta;
    [key: string]: Story | StoryMeta;
}