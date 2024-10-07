import Header from '@/app/components/Header'
import TaskManageForm from '@/app/components/TaskManageForm'
import React from 'react'

const ManageTask = ({ searchParams }: any) => {
    const { edit } = searchParams
    return (
        <div>
            <Header />
            <TaskManageForm edit={edit} />
        </div>
    )
}

export default ManageTask
