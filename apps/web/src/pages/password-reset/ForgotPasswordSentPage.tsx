import PasswordResetSentCard from "@/auth/components/PasswordResetSentCard";

export default function ForgotPasswordSentPage({
	email,
	redirectTo,
}: {
	email?: string;
	redirectTo?: string;
}) {
	return <PasswordResetSentCard email={email} redirectTo={redirectTo} />;
}
