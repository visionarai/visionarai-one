// 'use client';
// import { useTranslations } from 'next-intl';
// import { FormEvent, useState } from 'react';

import { Button } from "@visionarai-one/ui";
import { Link } from "@/i18n/navigation";
import { LoginForm } from "./_form";

export default function LoginPage() {
	// const t = useTranslations('Auth');
	// const [loading, setLoading] = useState(false);

	// const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
	//   e.preventDefault();
	//   setLoading(true);
	//   // TODO: Implement authentication logic
	//   setTimeout(() => setLoading(false), 1000);
	// };

	return (
		<div className="space-y-4">
			<Button asChild>
				<Link href="/register">Go to Register</Link>
			</Button>
			<LoginForm />
		</div>
	);
}
