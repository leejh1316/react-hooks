import clsx from "clsx";
import { forwardRef, type ComponentPropsWithRef } from "react";

/* ────────────────────────────────────────────────────────────
 * Spacing Types & Utilities
 * ──────────────────────────────────────────────────────────── */

/**
 * Tailwind 기본 spacing scale 중 허용되는 margin 값.
 * 짝수 기반으로 구성하되, 실용적인 홀수(1, 3, 5, 7)도 포함합니다.
 */
type MarginValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 12 | 14 | 16 | 20 | 24;

interface SpacingProps {
  /** margin-top (Tailwind spacing scale) */
  mt?: MarginValue;
  /** margin-bottom (Tailwind spacing scale) */
  mb?: MarginValue;
}

/**
 * Tailwind JIT가 정적 분석으로 클래스를 감지할 수 있도록
 * 모든 허용 값을 리터럴 문자열로 매핑합니다.
 */
const MT_CLASS: Record<MarginValue, string> = {
  0: "mt-0",
  1: "mt-1",
  2: "mt-2",
  3: "mt-3",
  4: "mt-4",
  5: "mt-5",
  6: "mt-6",
  7: "mt-7",
  8: "mt-8",
  10: "mt-10",
  12: "mt-12",
  14: "mt-14",
  16: "mt-16",
  20: "mt-20",
  24: "mt-24",
};

const MB_CLASS: Record<MarginValue, string> = {
  0: "mb-0",
  1: "mb-1",
  2: "mb-2",
  3: "mb-3",
  4: "mb-4",
  5: "mb-5",
  6: "mb-6",
  7: "mb-7",
  8: "mb-8",
  10: "mb-10",
  12: "mb-12",
  14: "mb-14",
  16: "mb-16",
  20: "mb-20",
  24: "mb-24",
};

function spacingCls(mt?: MarginValue, mb?: MarginValue): string {
  return clsx(mt !== undefined && MT_CLASS[mt], mb !== undefined && MB_CLASS[mb]);
}

/* ────────────────────────────────────────────────────────────
 * Component Props
 * ──────────────────────────────────────────────────────────── */

type DocumentRootProps = ComponentPropsWithRef<"article">;
type DocumentTitleProps = ComponentPropsWithRef<"h1"> & SpacingProps;
type DocumentDescriptionProps = ComponentPropsWithRef<"p"> & SpacingProps;
type DocumentHeading1Props = ComponentPropsWithRef<"h2"> & SpacingProps;
type DocumentHeading2Props = ComponentPropsWithRef<"h3"> & SpacingProps;
type DocumentHeading3Props = ComponentPropsWithRef<"h4"> & SpacingProps;
type DocumentParagraphProps = ComponentPropsWithRef<"p"> & SpacingProps;
type DocumentDividerProps = Omit<ComponentPropsWithRef<"hr">, "children"> & SpacingProps;

/* ────────────────────────────────────────────────────────────
 * Root
 * ──────────────────────────────────────────────────────────── */

const Root = forwardRef<HTMLElement, DocumentRootProps>(({ className, ...props }, ref) => (
  <article ref={ref} className={clsx("font-pretendard", className)} {...props} />
));
Root.displayName = "Document.Root";

/* ────────────────────────────────────────────────────────────
 * Title — <h1>
 * text-headline-1, font-semibold, ink-primary
 * 기본 간격: mb-4
 * ──────────────────────────────────────────────────────────── */

const Title = forwardRef<HTMLHeadingElement, DocumentTitleProps>(({ className, mt, mb = 4, ...props }, ref) => (
  <h1
    ref={ref}
    data-document-element="title"
    className={clsx("text-headline-1 text-ink-primary font-semibold", spacingCls(mt, mb), className)}
    {...props}
  />
));
Title.displayName = "Document.Title";

/* ────────────────────────────────────────────────────────────
 * Description — <p>
 * text-body-1, font-normal, ink-secondary
 * 기본 간격: mb-8
 * ──────────────────────────────────────────────────────────── */

const Description = forwardRef<HTMLParagraphElement, DocumentDescriptionProps>(({ className, mt, mb = 8, ...props }, ref) => (
  <p
    ref={ref}
    data-document-element="description"
    className={clsx("text-body-1 text-ink-secondary font-normal", spacingCls(mt, mb), className)}
    {...props}
  />
));
Description.displayName = "Document.Description";

/* ────────────────────────────────────────────────────────────
 * Heading1 — <h2>
 * text-title-2, font-semibold, ink-primary
 * 기본 간격: mt-12 mb-4
 * ──────────────────────────────────────────────────────────── */

const Heading1 = forwardRef<HTMLHeadingElement, DocumentHeading1Props>(({ className, mt = 12, mb = 4, ...props }, ref) => (
  <h2
    ref={ref}
    data-document-element="heading1"
    className={clsx("text-title-1 text-ink-primary font-semibold", spacingCls(mt, mb), className)}
    {...props}
  />
));
Heading1.displayName = "Document.Heading1";

/* ────────────────────────────────────────────────────────────
 * Heading2 — <h3>
 * text-title-3, font-semibold, ink-primary
 * 기본 간격: mt-8 mb-3
 * ──────────────────────────────────────────────────────────── */

const Heading2 = forwardRef<HTMLHeadingElement, DocumentHeading2Props>(({ className, mt = 8, mb = 3, ...props }, ref) => (
  <h3
    ref={ref}
    data-document-element="heading2"
    className={clsx("text-title-3 text-ink-primary font-semibold", spacingCls(mt, mb), className)}
    {...props}
  />
));
Heading2.displayName = "Document.Heading2";

/* ────────────────────────────────────────────────────────────
 * Heading3 — <h4>
 * text-title-4, font-semibold, ink-primary
 * 기본 간격: mt-6 mb-2
 * ──────────────────────────────────────────────────────────── */

const Heading3 = forwardRef<HTMLHeadingElement, DocumentHeading3Props>(({ className, mt = 6, mb = 2, ...props }, ref) => (
  <h4
    ref={ref}
    data-document-element="heading3"
    className={clsx("text-title-4 text-ink-primary font-semibold", spacingCls(mt, mb), className)}
    {...props}
  />
));
Heading3.displayName = "Document.Heading3";

/* ────────────────────────────────────────────────────────────
 * Paragraph — <p>
 * text-body-1, font-normal, ink-primary
 * 기본 간격: mb-4
 * ──────────────────────────────────────────────────────────── */

const Paragraph = forwardRef<HTMLParagraphElement, DocumentParagraphProps>(({ className, mt, mb = 4, ...props }, ref) => (
  <p
    ref={ref}
    data-document-element="paragraph"
    className={clsx("text-body-1 text-ink-secondary font-normal", spacingCls(mt, mb), className)}
    {...props}
  />
));
Paragraph.displayName = "Document.Paragraph";

/* ────────────────────────────────────────────────────────────
 * Divider — <hr>
 * border-line-regular
 * 기본 간격: my-8 (mt-8 mb-8)
 * ──────────────────────────────────────────────────────────── */

const Divider = forwardRef<HTMLHRElement, DocumentDividerProps>(({ className, mt = 8, mb = 8, ...props }, ref) => (
  <hr
    ref={ref}
    data-document-element="divider"
    className={clsx("border-line-regular border-t", spacingCls(mt, mb), className)}
    {...props}
  />
));
Divider.displayName = "Document.Divider";

/* ────────────────────────────────────────────────────────────
 * Compound Export
 * ──────────────────────────────────────────────────────────── */

const Document = {
  Root,
  Title,
  Description,
  Heading1,
  Heading2,
  Heading3,
  Paragraph,
  Divider,
};

export { Document };

export type {
  MarginValue,
  SpacingProps,
  DocumentRootProps,
  DocumentTitleProps,
  DocumentDescriptionProps,
  DocumentHeading1Props,
  DocumentHeading2Props,
  DocumentHeading3Props,
  DocumentParagraphProps,
  DocumentDividerProps,
};
