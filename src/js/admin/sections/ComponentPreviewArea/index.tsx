import { useState } from '@wordpress/element';
import { ShowcaseWrapper, Sidebar, Content, ComponentSection, StorySection } from './styled';
import { getComponentList, getComponentStories } from './stories';

import { Heading } from '@admin/components/Experimental';

export default function ComponentShowcase() {
    const components = getComponentList();
    const [activeComponent, setActiveComponent] = useState(components[0]?.id || '');

    const currentStories = activeComponent ? getComponentStories(activeComponent) : null;

    return (
        <ShowcaseWrapper>
            <Sidebar>
                <Heading level={3} size="subheadline" weight="bold">Components</Heading>
                <ul>
                    {components.map((comp) => (
                        <li key={comp.id}>
                            <button
                                className={activeComponent === comp.id ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    return setActiveComponent(comp.id);
                                }}
                                title={comp.description}
                            >
                                {comp.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </Sidebar>
            <Content>
                {currentStories && (
                    <>
                        <ComponentSection>
                            <h1>{currentStories.meta.title}</h1>
                            {currentStories.meta.description && (
                                <p className="component-description">
                                    {currentStories.meta.description}
                                </p>
                            )}
                        </ComponentSection>

                        {currentStories.stories.map((story) => (
                            <StorySection key={story.id}>
                                <h3>{story.title}</h3>
                                {story.description && (
                                    <p className="story-description">{story.description}</p>
                                )}
                                <div className="story-preview">
                                    <story.component />
                                </div>
                            </StorySection>
                        ))}
                    </>
                )}
            </Content>
        </ShowcaseWrapper>
    );
}