import React, { useCallback, useEffect, useState } from "react";
import ResponsiveLogo from "../ResponsiveLogo";
import WelcomeIntro from "../WelcomeIntro";
import useConversationMemory from "./ConversationMemory";
import { ConversationDestination } from "./ConversationPrompt";
import ConversationStopContents from "./ConversationStop/ConversationStopContents";
import RenderedConversation from "./RenderedConversation";

interface Props {
  path: string;
  contents: React.ReactElement;
}

const Conversation = ({ path, contents }: Props) => {
  const openingQuestion: ConversationDestination[] = [
    { prompt: "Show me your credentials.", href: "resume" },
    { prompt: "Cool. What are your hobbies?", href: "hobbies" },
    { prompt: "I want to work with you!", href: "contact" },
    { prompt: "What’re you thinking about?", href: "blog" },
    { prompt: "This is weird. Show me a normal homepage.", href: "normcore" }
  ];

  const [lastLoggedPath, setLastLoggedPath] = useState<string | undefined>(
    undefined
  );

  const contentsAreEmptyFragment =
    contents.type === React.Fragment &&
    !(contents.props as React.PropsWithChildren<unknown>).children;

  const convo = useConversationMemory(
    contentsAreEmptyFragment ? { page: contents } : undefined
  );
  const blockCount = convo.stack.length + 2; // 2 for logo and welcome

  useEffect(() => {
    if (path !== lastLoggedPath && !contentsAreEmptyFragment) {
      setLastLoggedPath(path);
      convo.handleNavigation(contents);
    }
  }, [
    path,
    lastLoggedPath,
    contents,
    contentsAreEmptyFragment,
    convo.addToStack
  ]);

  const getBlock = useCallback(
    (ind: number): React.ReactChild => {
      const stackInd = ind - 2;

      if (ind === 0) {
        return <ResponsiveLogo />;
      } else if (ind === 1) {
        return <WelcomeIntro />;
      } else {
        return <ConversationStopContents stop={convo.stack[stackInd]} />;
      }
    },
    [convo]
  );

  const conversationClasses = [
    "conversation-flow",
    "min-h-full",
    "col-span-12",
    "md:col-span-8",
    "md:col-start-2",
    "lg:col-start-0",
    "pb-16",
    "xl:pb-56",
    "flex",
    "flex-col",
    "justify-end",
    "content-start",
    "relative"
  ].join(" ");

  return (
    <div className="container grid grid-cols-12 gap-4 min-h-screen mx-auto px-2 md:px-1">
      <RenderedConversation
        staticRenderUntilIndex={0}
        className={conversationClasses}
        blockCount={blockCount}
        getBlock={getBlock}
        choices={openingQuestion}
        onChoice={convo.addToStack}
      />
    </div>
  );
};

export default Conversation;