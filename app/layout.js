import './globals.css';

export const metadata = {
  title: '투표 앱',
  description: 'Claude Code로 만든 실시간 투표 앱',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
