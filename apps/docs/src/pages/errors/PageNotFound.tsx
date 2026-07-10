import { Card } from "@components/ui/Card";
import { Document } from "@components/ui/Document";
import { Link } from "react-router";

export default function PageNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 md:p-12">
        <Document.Root>
          <p className="text-body-2 text-primary mb-2 font-semibold">Timeless-ui</p>
          <Document.Title>페이지를 찾을 수 없습니다</Document.Title>
          <Document.Description>요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</Document.Description>

          <Document.Divider />

          <Document.Heading2>가능한 원인</Document.Heading2>
          <Document.Paragraph>
            • 주소를 잘못 입력하셨을 수 있습니다.
            <br />
            • 페이지가 삭제되었거나 URL이 변경되었을 수 있습니다.
            <br />• 링크가 만료되었을 수 있습니다.
          </Document.Paragraph>

          <Document.Heading2>다음 단계</Document.Heading2>
          <Document.Paragraph mb={6}>주소를 다시 확인하시거나 아래 버튼을 클릭하여 홈페이지로 돌아가세요.</Document.Paragraph>

          <Link
            to="/"
            className="bg-primary-500 text-body-2 hover:bg-primary-600 focus:ring-primary-500 inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            홈으로 돌아가기
          </Link>
        </Document.Root>
      </Card>
    </div>
  );
}
