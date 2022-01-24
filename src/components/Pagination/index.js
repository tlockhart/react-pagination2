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

export let Pagination = ({data, RenderComponent, title, recommendedPageLimit, dataLimit}) => {
    const recordCount = data.length;
    const [pages] = useState(Math.ceil(recordCount / dataLimit));
    const [currentPage, setCurrentPage] = useState(1);

    const totalPgsDivisibility = recommendedPageLimit === 1 ? pages - recommendedPageLimit : pages % recommendedPageLimit;
    const totalPgsInRecLimit = totalPgsDivisibility === 0;

    useEffect(() => {
        window.scrollTo({behavior: 'smooth', top: '0px'});
    }, [currentPage, pages]);

    // Increments the current page by calling setCurrentPage.
    const goToNextPage = () => {
        let nextPage = currentPage + recommendedPageLimit;
        const nextPageDivisibility = nextPage % recommendedPageLimit;

        const nextPagePosition =
            nextPageDivisibility === 0 ? recommendedPageLimit : nextPageDivisibility;

        const offset = nextPageDivisibility !== 1 ? nextPagePosition - 1 : 0;

        nextPage += -offset;

        let curPgCanShiftFwd = nextPage <= pages;

        switch (true) {
            case curPgCanShiftFwd:
                setCurrentPage(nextPage);
                break;
            default:
                setCurrentPage((page) => page + 1);
        }
    }

    // Decrements the current page by calling setCurrentPage
    const goToPreviousPage = () => {
        let previousPage = Math.abs(currentPage - recommendedPageLimit);
        const currentPageDivisibility = currentPage % recommendedPageLimit;

        const currentPagePosition =
            currentPageDivisibility === 0
                ? recommendedPageLimit
                : currentPageDivisibility;

        const offset = currentPageDivisibility !== 1 ? currentPagePosition - 1 : 0;

        previousPage += -offset;

        let curPgCanShiftBkwds = previousPage >= 1;

        // Override for EdgeCase currentPage <= recommendedPageLimit
        if (currentPage <= recommendedPageLimit) curPgCanShiftBkwds = false;

        switch (true) {
            case curPgCanShiftBkwds:
                setCurrentPage(previousPage);
                break;
            default:
                setCurrentPage((page) => page - 1);
        }
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
        /*************************************************************
         * EdgeCases: pageNumbers size less than recommendedPageLimit
         *************************************************************/

        let isGrpSizeLTRecLimit =
            !totalPgsInRecLimit && recommendedPageLimit < pages;
        let isGrpSizeGTRecLimit =
            !totalPgsInRecLimit && recommendedPageLimit > pages;

        let startOfFinalSet = pages - totalPgsDivisibility + 1;
        let curPgInFinalSet = currentPage >= startOfFinalSet;
        /*********************************************************/

        // Create array to hold page numbers
        const pageNumbers = [];

        // Calculate the starting page, based on the currentPage
        let start =
            Math.floor((currentPage - 1) / recommendedPageLimit) *
            recommendedPageLimit;

        // Fill the array with the indexes of the pageNumber items
        for (let idx = 1; idx <= recommendedPageLimit; idx++) {
            let newIdx = start + idx;
            pageNumbers.push(newIdx);
        }
        // console.log("Pages to Display Per Group:", pageNumbers);

        // Pop pageNumbers array for edgeCase:
        if ((isGrpSizeLTRecLimit || isGrpSizeGTRecLimit) && curPgInFinalSet) {
            let numberOfPops = recommendedPageLimit - totalPgsDivisibility;

            // Pop of extra array:
            for (let idx = 1; idx <= numberOfPops; idx++) {
                pageNumbers.pop();
            }
        }
        return pageNumbers;
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

            {recordCount > dataLimit ? (<div className="pagination">
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
            </div>) : null}
        </div>
    );
}