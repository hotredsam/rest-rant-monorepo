import { createContext, useState, useEffect } from "react"; // Don't forget to import useEffect

export const CurrentUser = createContext();

function CurrentUserProvider({ children }) {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {

        const getLoggedInUser = async () => {
            let token = localStorage.getItem('token'); // Retrieve the token from local storage
            if (token) { // Only make the request if the token exists
                let response = await fetch('http://localhost:5000/authentication/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Add token to Authorization header
                    }
                });
                let user = await response.json();
                setCurrentUser(user);
            }
        };

        getLoggedInUser();
    }, []);

    return (
        <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </CurrentUser.Provider>
    );
}

export default CurrentUserProvider;
