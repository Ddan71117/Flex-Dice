
import React from 'react';
import { auth } from '../../pages/api/auth/[...nextauth]';
import { type User } from 'next-auth';
export default async function userInfoPage() {
    const session = await auth()

    const SignedIn = ({ user }: { user: User }) => {
        console.log('user', user)
        console.log('username', user.username)
        return <div>Welcome, {user.username}</div>
    }

    return (
        <div>
            {!!session?.user ? <SignedIn user={session.user} /> : <div>Please sign in</div>}
        </div>
    )
}