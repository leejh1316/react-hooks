import React from "react";

interface BreakableCamelCaseProps {
  text: string;
}

/**
 * camelCase 문자열의 단어 경계마다 <wbr />을 삽입해
 * 긴 이름이 필요할 때 자연스럽게 줄바꿈되도록 렌더링한다.
 * camelCase가 아닌 문자열은 그대로 출력한다.
 * e.g. "useIntersectionObserverGroup" → use|Intersection|Observer|Group
 */
const BreakableCamelCase = ({ text }: BreakableCamelCaseProps) => {
  if (!text) return null;

  const parts = text.split(/(?<=[a-z0-9])(?=[A-Z])/g);

  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && <wbr />}
          {part}
        </React.Fragment>
      ))}
    </>
  );
};

export default BreakableCamelCase;
