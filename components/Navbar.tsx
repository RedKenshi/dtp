import Link from 'next/link';
import Button from './utils/Button';
import { useContext } from 'react';
import { UserContext } from '@/contexts/User';
import { IconSVGCode } from './utils/IconSVG';

type Props = {}

const Navbar = ({}:Props) => {
    const { user, username, logout } = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href={"/"}>
                        <Button color={'slate'} text='FEED'/>
                    </Link>
                </li>
                <div className='flex justify-center items-center gap-8'>
                    {username && (
                        <>
                            <li>
                                <Link href={"/admin"}>
                                    <Button text='Write posts'/>
                                </Link>
                            </li>
                            <li>
                                <Button text='Log Out' onClick={logout}/>
                            </li>
                            <li>
                                <Link href={`/${username}`}>
                                    <img src={user?.photoURL}/>
                                </Link>
                            </li>
                      </>  
                    )}
                </div>
            </ul>
        </nav>
    )
}

export default Navbar;