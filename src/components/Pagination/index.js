/*
** data: An array of data that should be shown in the paginated form
** RenderComponent: A component that should be used to show the paginated data. In our case, this will be the
* Index component that we created earlier.
** title: This is the title that should describe what the data is about. In our case, it will be the Posts
** dataLimit: The number of posts to be shown on each page. In our case, it will be 10.
** pageLimit: The number of pages to be shown in the pagination. In our case, it will be 5 pages at a time.
*/
import React, {useState, useEffect} from "react";
import "./styles.css";

export let Pagination = ({data, RenderComponent, title, pageLimit, dataLimit}) => {
    const [pages] = useState(Math.round(data.length / dataLimit));
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        window.scrollTo({behavior: 'smooth', top: '0px'});
    }, [currentPage]);

    // Increments the current page by calling setCurrentPage.
    const goToNextPage = () => {
        setCurrentPage((page) => page + 1);
    }

    // Decrements the current page by calling setCurrentPage
    const goToPreviousPage = () => {
        setCurrentPage((page) => page - 1);
    }

    // Changes the current page to the page number that was clicked by the user.
    const changePage = (event) => {
        event.preventDefault();
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
    }

    // Returns the num of posts equal to the dataLimit (10 posts), which will then be displayed to the user.
    const getPaginatedData = () => {
        const startIndex = currentPage * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        return data.slice(startIndex, endIndex);
    };

    // Shows the group of page numbers in the pagination.
    // Since PageLimit is 3, we will show 3 numbers
    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
        return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
    };

    return (
        <div>
            <h1>{title}</h1>

            {/* show the posts, 10 posts at a time */}
            <div className="dataContainer">
                {getPaginatedData().map((d, idx) => (
                    <RenderComponent key={idx} data={d}/>
                ))}
            </div>

            {/* show the pagiantion
        it consists of next and previous buttons
        along with page numbers, in our case, 5 page
        numbers at a time
    */}
            <div className="pagination">
                {/* previous button */}
                <button
                    onClick={goToPreviousPage}
                    className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
                >
                    prev
                </button>

                {/* show page numbers */}
                {getPaginationGroup().map((item, index) => (
                    <button
                        key={index}
                        onClick={changePage}
                        className={`paginationItem ${currentPage === item ? 'active' : null}`}
                    >
                        <span>{item}</span>
                    </button>
                ))}

                {/* next button */}
                <button
                    onClick={goToNextPage}
                    className={`next ${currentPage === pages ? 'disabled' : ''}`}
                >
                    next
                </button>
            </div>
        </div>
    );
}