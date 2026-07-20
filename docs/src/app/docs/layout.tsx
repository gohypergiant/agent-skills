import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout {...baseOptions()} tree={source.getPageTree()} tabMode='auto' tabs={[
      {
        title: 'Standard Toolkit',
        description: 'TODO',
        url: 'https://standard-toolkit.accelint.io',
      },
      {
        title: 'Neo Toolkit',
        description: 'TODO',
        url: 'https://neo-toolkit.accelint.io',
      },
      {
        title: 'Agent Skills',
        description: 'TODO',
        url: '/docs',
      },
    ]}>
      {children}
    </DocsLayout>
  );
}
