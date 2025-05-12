import React from 'react'
import SummaryCard from './SummaryCard.jsx'
import { FaBuilding, FaCheckCircle, FaFileAlt, FaHourglassHalf, FaMoneyBillWave, FaTimesCircle, FaUsers } from 'react-icons/fa'

const AdminSummary = () => {
    return (
        <div className='p-6'>
            <h3 className='text-2xl font-bold'>Dashboard Overview</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                <SummaryCard icon={<FaUsers />} text="Presence" number={13} color="bg-teal-600" />
                <SummaryCard icon={<FaBuilding />} text="LOP(Loss Of Pay)" number={5} color="bg-yellow-600"/>
                <SummaryCard icon={<FaMoneyBillWave />} text="Late Login" number={0} color="bg-red-600"/>
                <SummaryCard icon={<FaMoneyBillWave />} text="Halfday" number={0} color="bg-red-600"/>
                <SummaryCard icon={<FaMoneyBillWave />} text="Total Casual Leave" number={24} color="bg-red-600"/>
                <SummaryCard icon={<FaMoneyBillWave />} text="Earned Leave" number={12} color="bg-red-600"/>
                <SummaryCard icon={<FaMoneyBillWave />} text="Sick Leave" number={12} color="bg-red-600"/>
            </div>

        </div>

    )
}

export default AdminSummary