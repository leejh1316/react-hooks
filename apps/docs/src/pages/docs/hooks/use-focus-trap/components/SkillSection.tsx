import { CodeBlock } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import { SKILL_INSTALL_CODE } from "../constants/code";

const SkillSection = () => {
  return (
    <section>
      <Document.Heading1>Agent Skill</Document.Heading1>
      <Document.Paragraph>
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의(
        <InlineCode>skills/use-focus-trap/SKILL.md</InlineCode>)를 함께 제공합니다. "포커스 트랩", "모달 접근성", "Tab 순환", "키보드
        내비게이션" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅 시그니처, 포커스 가능 요소 판별 기준, 중첩 트랩·Portal·지연
        렌더링 등의 엣지 케이스, WAI-ARIA 접근성 체크리스트를 반영한 코드를 작성합니다.
      </Document.Paragraph>
      <Document.Paragraph>
        모노레포의 SKILL 정의를 프로젝트 스킬 디렉터리로 복사하면 에이전트가 자동으로 인식합니다.
      </Document.Paragraph>
      <CodeBlock code={SKILL_INSTALL_CODE} language="bash" />
    </section>
  );
};

export default SkillSection;
