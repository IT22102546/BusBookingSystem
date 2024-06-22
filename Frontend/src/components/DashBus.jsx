import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import html2pdf from 'html2pdf.js';

export default function DashBus() {
  const { currentUser } = useSelector((state) => state.user);
  const [userBus, setUserBus] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [busIdToDelete, setBusIdToDelete] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await fetch(`/api/buses/getallBuses?searchTerm=${searchTerm}`);
        const data = await res.json();
        if (res.ok) {
          setUserBus(data.buses); 
        } else {
          console.error("Failed to fetch buses:", data.message);
        }
      } catch (error) {
        console.error("Error fetching buses:", error.message);
      }
    };

    fetchBuses();
  }, [searchTerm]);

  const handleDeleteBus = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/buses/deletebus/${busIdToDelete}/${currentUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserBus((prev) =>
          prev.filter((bus) => bus._id !== busIdToDelete)
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
          font-size: 14px;
        }
        td {
          font-size: 12px;
        }
      </style>
      <h1><b>Bus Details Report</b></h1>
      <br>
      <br>
      <table>
        <thead>
          <tr>
            <th>Updated At</th>
            <th>Company</th>
            <th>Seat</th>
            <th>Price</th>
            <th>Start Station</th>
            <th>To Station</th>
            <th>Seat Layout</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
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
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const options = {
      margin: 1,
      filename: 'bus_report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(options).from(content).save();
  };


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div className='flex justify-between'>
        <input
          type="text"
          placeholder="Search Buses.."
          value={searchTerm}
          onChange={handleSearch}
          className="px-3 py-2 w-150 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mr-2 h-10 dark:bg-slate-800  placeholder-gray-500"
        />
        <Button 
          gradientDuoTone='purpleToBlue'
          outline
          onClick={generatePDFReport}
        >
          Generate Report
        </Button>
      </div>

      {currentUser.isAdmin && userBus.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Company</Table.HeadCell>
              <Table.HeadCell>Start Station</Table.HeadCell>
              <Table.HeadCell>To Station</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {userBus.map((bus) => (
              <Table.Body className='divide-y' key={bus._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(bus.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link className='font-medium text-gray-900 dark:text-white' to="">
                      {bus.company}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{bus.startStation}</Table.Cell>
                  <Table.Cell>{bus.toStation}</Table.Cell>
                  <Table.Cell>
                    <span
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                      onClick={() => {
                        setShowModal(true);
                        setBusIdToDelete(bus._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='text-teal-500 hover:underline' to={`/updatebus/${bus._id}`}>
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
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">Are you sure you want to delete this bus?</h3>
          </div>
          <div className='flex justify-center gap-4'>
            <Button color='failure' onClick={handleDeleteBus}>
              Yes, I am sure
            </Button>
            <Button color='gray' onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
