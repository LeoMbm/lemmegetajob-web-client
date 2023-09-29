'use client'
import React from 'react'
import { Checkbox, Spinner, Table } from 'flowbite-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type Job = {
    id: number,
    position: string,
    company: string,
    location: string,
    apply_link: string,
    link_id: string,
    applied: boolean,
    applied_on: string,
    added_on: string,
    userId: string
}



export const TableJob = () => {
    const [jobList, setJobList] = React.useState<Job[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const perPage = 25;
    const [selectAll, setSelectAll] = React.useState(false);
    const [selectedItems, setSelectedItems] = React.useState<number[]>([]);

    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectAll(false);
            setSelectedItems([]);
        } else {
            setSelectAll(true);
            setSelectedItems(jobList.map((job) => job.id));
        }
    };

    const handleSelectChange = (itemId: number) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }

        const allSelected = jobList.every((job) => selectedItems.includes(job.id));
        setSelectAll(allSelected);
    };

    

    React.useEffect(() => {
        setLoading(true);
        fetch(`/api/data/jobs?page=${currentPage}&perPage=${perPage}`)
            .then((res) => res.json())
            .then((data) => {
                setJobList(data);
                console.log(data);
                
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [currentPage]); 

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    
    return (
        <>
        <div className="overflow-x-auto">
        <table className="w-full min-w-max text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input
                                    id="checkbox-all-search"
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    onChange={handleSelectAllChange}
                                    checked={selectAll}
                                />
                                <label htmlFor="checkbox-all-search" className="sr-only">
                                    checkbox
                                </label>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Job Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Company
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Location
                        </th>
                        <th scope="col" className="px-6 py-3">
                            URL
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Applied
                        </th>
                        <th scope="col" className="px-6 py-3">
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={7} className="p-4">
                                <div className="flex justify-center">
                                    <Spinner className="w-6 h-6" />
                                </div>
                            </td>
                        </tr>
                    )}
                    {jobList.map((job, index) => (
                        <tr
                            key={index}
                            className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                                selectedItems.includes(job.id) ? 'bg-green-100' : ''
                            }`}
                        >
                            <td className="w-4 p-4">
                                <div className="flex items-center">
                                    <input
                                        id={`checkbox-table-search-${index}`}
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        checked={selectedItems.includes(job.id)}
                                        onChange={() => handleSelectChange(job.id)}
                                    />
                                    <label htmlFor={`checkbox-table-search-${index}`} className="sr-only">
                                        checkbox
                                    </label>
                                </div>
                            </td>
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {job.position}
                          </th>
                          <td className="px-6 py-4">
                              {job.company}
                          </td>
                          <td className="px-6 py-4">
                              {job.location}
                          </td>
                          <td className="px-6 py-4">
                            <Link href={job.apply_link} target='blank'>
                              <span className='text-blue-600'>URL</span>
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                              {job.applied ? <Checkbox checked disabled/> : <Checkbox  disabled/>}
                          </td>
                          <td className="px-6 py-4">
                              <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
          <nav className="flex items-center justify-between pt-4" aria-label="Table navigation">
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Showing <span className="font-semibold text-gray-900 dark:text-white">1-25</span> of <span className="font-semibold text-gray-900 dark:text-white">{jobList.length}</span></span>
              <ul className="inline-flex -space-x-px text-sm h-8">
                  <li>
                      <button onClick={prevPage} className={`flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`} disabled={currentPage === 1}>Previous</button>
                  </li>
                  {Array.from({ length: 5 }).map((_, page) => (
                      <li key={page}>
                          <button
                          onClick={() => setCurrentPage(page + 1)} 
                          className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 ${currentPage === page + 1 ? 'bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-white' : 'hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}>{page + 1}</button>
                      </li>
                  ))}
                  <li>
                      <button onClick={nextPage} className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>Next</button>
                  </li>
              </ul>
          </nav>
      </>
  );
}


    