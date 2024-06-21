
import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import html2pdf from 'html2pdf.js';

export default function DashBus() {
  const { currentUser } = useSelector((state) => state.user);
  const [userBus, setUserBus] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [busIdToDelete, setBusIdToDelete] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await fetch(`/api/buses/getbuses?searchTerm=${searchTerm}`);
        const data = await res.json();
        if (res.ok) {
          setUserBus(data.products);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchBus();
  }, [searchTerm]);

  const handleDeleteProduct = async () => {
    setShowModel(false);
    try {
      const res = await fetch(
        `/api/buses/deletebus/${busIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setBusIdToDelete((prev) =>
          prev.filter((product) => product._id !== busIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
   
  };

  const generatePDFReport = () => {
    const content = `
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
          font-size: 14px; /* Adjust font size */
        }
        td {
          font-size: 12px; /* Adjust font size */
        }
      </style>
      <h1><b>Bus Details Report</b></h1>
      <br>
      <br>
      <table>
        <thead>
          <tr>
            <th>Updated At</th>
            <th>Title</th>
            <th>Category</th>
            <th>Unit Price</th>
            <th>Quantity</th>

            <th>Supplier</th>
          </tr>
        </thead>
        <tbody>
          ${userBus.map((bus) => `
            <tr>
              <td>${new Date(bus.createdAt).toLocaleDateString()}</td>
              <td>${bus.company}</td>
              <td>${bus.seat}</td>
              <td>${bus.price}</td>
              <td>${bus.startStation}</td>
              <td>${bus.toStation}</td>
              <td>${bus.seatLayout}</td>
              <td>${bus.departureTime}</td>
              <td>${bus.arrivalTime}</td>
              <td>${bus.departureTime}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  
    html2pdf().from(content).set({ margin: 1, filename: 'product_report.pdf' }).save();
  };
  

  const handleGenerateReport = () => {
    generatePDFReport();
  
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div className='flex justify-between'>
      <input
          type="text"
          placeholder="Search Products.."
          value={searchTerm}
          onChange={handleSearch}
          className="px-3 py-2 w-150 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mr-2 h-10 dark:bg-slate-800  placeholder-gray-500"
        />
        <div></div>
        
           <Button 
                gradientDuoTone='purpleToBlue'
                outline
                onClick={handleGenerateReport}
                className=""
              >
              Generate Report
           </Button>
      </div>
      
      
      {currentUser.isAdmin && userBus.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Product Image</Table.HeadCell>
              <Table.HeadCell>Product Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Supplier</Table.HeadCell>
              <Table.HeadCell>Stock Level</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {userBus.map((bus) => (
              <Table.Body className='divide-y' key={bus._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(bus.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/product/${bus.slug}`}>
                      <img
                        src={bus.image}
                        alt={bus.company}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='font-medium text-gray-900 dark:text-white' to="/">
                      {bus.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{bus.startStation}</Table.Cell>
                  <Table.Cell>{bus.toStation}</Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer'
                      onClick={() => {
                        setShowModel(true);
                        setBusIdToDelete(bus._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='text-teal-500 hover:underline' to={`/update-bus/${bus._id}`}>
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>No Buses to show</p>
      )}
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">Are you sure you want to Delete this Bus</h3>
          </div>
          <div className='flex justify-center gap-4'>
            <Button color='failure' onClick={handleDeleteProduct}>
              Yes, I am sure
            </Button>
            <Button color='gray' onClick={() => setShowModel(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
