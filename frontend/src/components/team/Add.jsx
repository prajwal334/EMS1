import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddTeam = () => {
    const [team, setTeam] = useState({
        teamname_id: "",
        description: ""
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setTeam({
            ...team,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:3000/api/team/add', team, {
                headers: {
                    "Authorization" : `Bearer ${localStorage.getItem('token')}`
                },
            })
            if (response.data.success) {
                navigate("/admin-dashboard/teams")
                }
            }  catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.error)
                }
            }
        }

    return (
            <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">Add Team</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="teamname_id" className="text-sm font-medium text-gray-700">Team Name</label>
                        <input type="text" name='teamname_id' onChange={handleChange} placeholder='Enter Team Name' className="mt-1 w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name='description' onChange={handleChange} placeholder='Describe the department' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' rows="4" required></textarea>
                    </div>
                    <button type="submit" className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py2 px-4 rounded'>Add Team</button>
                </form>
            </div>
    )
}

export default AddTeam