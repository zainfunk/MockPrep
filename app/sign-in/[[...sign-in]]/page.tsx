import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#3b82f6',
            colorBackground: '#111111',
            colorInputBackground: '#1a1a1a',
            colorInputText: '#ffffff',
            colorText: '#ffffff',
            colorTextSecondary: '#9ca3af',
            colorNeutral: '#374151',
            borderRadius: '0.75rem',
          },
          elements: {
            card: 'shadow-2xl border border-gray-800',
            headerTitle: 'text-white',
            headerSubtitle: 'text-gray-400',
            socialButtonsBlockButton:
              'border-gray-700 hover:border-gray-500 text-gray-200 bg-gray-800 hover:bg-gray-700',
            dividerLine: 'bg-gray-700',
            dividerText: 'text-gray-500',
            formFieldLabel: 'text-gray-300',
            formFieldInput:
              'bg-gray-800 border-gray-700 text-white focus:border-blue-500',
            footerActionText: 'text-gray-400',
            footerActionLink: 'text-blue-400 hover:text-blue-300',
            identityPreviewText: 'text-gray-300',
            identityPreviewEditButton: 'text-blue-400',
          },
        }}
      />
    </main>
  );
}
