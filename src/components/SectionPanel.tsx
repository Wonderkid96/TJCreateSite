type Props = {
  children: React.ReactNode;
  /** Background/utility classes for the panel. */
  className?: string;
};

/**
 * Plain full-width section wrapper. The stacked-scroll deck (pinning + slide
 * over) was removed so the page reads as a normal vertical scroll. Each child
 * section self-sizes (min-h-screen), so it simply stacks.
 */
export default function SectionPanel({ children, className = "" }: Props) {
  return <div className={`relative w-full ${className}`}>{children}</div>;
}
