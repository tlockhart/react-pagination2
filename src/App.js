import React, {useState, useEffect} from 'react';
import {Pagination} from "./components/Pagination";
import {Post} from "./components/Post";

const url = 'https://jsonplaceholder.typicode.com/posts';
const numOfPosts = 10;
const pageLimit = 2;
const dataLimit = 3;

export default function App() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');

    // Request posts:
    useEffect(() => {
        const getPosts = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                // console.log("Data:", data, "; length:", data.length);
                let posts;
                if (data.length > numOfPosts) {
                    posts = data.slice(0, numOfPosts + 1);
                } else
                    posts = data;
                setPosts(posts);
            } catch (e) {
                console.log("Error:", e);
            }
        };
        getPosts();

    }, []);

    if (error) return <h1>{error}</h1>;

    return (
        <div>
            {posts.length > 0 ? (
                <>
                    <Pagination
                        data={posts}
                        RenderComponent={Post}
                        title="Posts"
                        recommendedPageLimit={pageLimit}
                        dataLimit={dataLimit}
                    />
                </>
            ) : (
                <h1>No Posts to display</h1>
            )}
        </div>
    );
}
