import React from 'react'
import './styles/styles.scss'
import Moment from 'react-moment'
import {change_task_status, patch_task } from './Requestor'
import cookie from 'react-cookies'
import { IconContext } from 'react-icons'
import { IoMdCreate, IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
import { FaRegTrashAlt } from 'react-icons/fa'
import { delete_task } from './Requestor'
import swal from '@sweetalert/with-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default class Task extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            url: props.task.url,
            text: props.task.text,
            is_done: props.task.is_done,
            deadline: props.task.deadline ? new Date(props.task.deadline) : null,
            priority: props.task.priority,

            project_delete_task: props.project_delete_task,
            project_move: props.project_move
        }

        this.change_status = this.change_status.bind(this)
        this.deleteTask = this.deleteTask.bind(this)
        this.editTask = this.editTask.bind(this)
        this.watchFormText = this.watchFormText.bind(this)
        this.watchFormDeadline = this.watchFormDeadline.bind(this)
        this.changePriority = this.changePriority.bind(this)
        this.changePriorityUp = this.changePriorityUp.bind(this)
        this.changePriorityDown = this.changePriorityDown.bind(this)
    }

    render(){
        return this.display_task()
    }

    display_task(){
        const is_deadline_set = this.state.deadline !== null ? true : false
        const check_id = 'check' + this.state.url;
        const arrow_up_id = 'arrow_up' + this.state.url;
        const arrow_down_id = 'arrow_down' + this.state.url;

        return(
            <div className='task'>
                <div className='custom-control custom-checkbox taskCheck'>
                    <input type="checkbox" className="custom-control-input" id={check_id}
                     onChange={this.change_status} checked={this.state.is_done}/>
                    <label className="custom-control-label" htmlFor={check_id}/>
                </div>
                <div className='taskDoubleVerticalBorder'/>
                <div className='taskBody'>
                    <div className='taskText'>
                        {this.state.text}
                    </div>
                    {is_deadline_set &&<div className='deadline'>
                     <div>Deadline: <Moment date={this.state.deadline} format='DD MMMM YYYY' /></div>
                    </div>}
                </div>
                <div className='taskVerticalBorder'/>
                <div className='taskMenu'>
                    <IconContext.Provider value={{color: 'gray', size: 20}}>
                        <div className='taskArrows'>
                            <div>
                            <button className='transparentButton' type='button' ><IoIosArrowUp size={15} 
                            id={arrow_up_id} onClick={this.changePriorityUp} /></button>
                            </div>
                            <div className='taskMenuArrowsBorder' />
                            <div>
                            <button className='transparentButton' type='button' ><IoIosArrowDown size={15}
                            id={arrow_down_id} onClick={this.changePriorityDown} /></button>
                            </div>
                        </div>
                        <div className='taskMenuBorder'/>
                        <div>
                        <button className='transparentButton' type='button' onClick={this.editTask}><IoMdCreate /></button>
                        </div>
                        <div className='taskMenuBorder'/>
                        <div>
                        <button className='transparentButton' type='button' onClick={this.deleteTask}><FaRegTrashAlt /></button>
                        </div>
                    </IconContext.Provider>
                </div>
            </div>
        );
    }

    change_status(){
        const task_url = this.state.url
        const status = !this.state.is_done
        const user_token = cookie.load('user').token

        change_task_status(task_url, status, user_token)
        .then(data =>{
            this.setState({is_done: !this.state.is_done})
        })
        .catch(error => {
            swal(
                <div>
                    <h1>Error!</h1>        
                    <p>Connection error. Please, try again.</p>
                </div>
            )
        });
    }

    deleteTask(){
        const task_url = this.state.url
        const user_token = cookie.load('user').token

        delete_task(task_url, user_token)
        .then(() => {
            this.state.project_delete_task(task_url)
        })
        .catch(error => {
            swal(
                <div>
                    <h1>Error!</h1>        
                    <p>Connection error. Please, try again.</p>
                </div>
            )
        });
    }

    editTask(){
        this.props.task.deadline = undefined
        this.props.task.text = undefined

        swal(
            <SweetTaskForm deadline={this.state.deadline} text={this.state.text}
            report_text={this.watchFormText} report_deadline={this.watchFormDeadline}/>,
            {
                button: {
                    text: "Edit Task",
                    value: 'edit_task',
                    closeModal: true
                } 
            }
        ).then(value => {
            if(value !== 'edit_task'){
                return
            }

            const text = this.props.task.text
            const deadline = this.props.task.deadline

            console.log(text)
            console.log(deadline)

            if(!text === undefined && !deadline === undefined){
                return
            }

            const task = {}

            if(text){
                task['text'] = text
            }
            else if(text === null){
                swal(
                    {
                        title: 'Error',
                        text: 'Task text must not be empty!'
                    }
                )

                return
            }

            if(deadline){
                const day = deadline.getDate()
                const month = deadline.getMonth() + 1
                const year = deadline.getFullYear()

                task['deadline'] = year + '-' + month + '-' + day
            }
            else if(deadline === null){
                task['deadline'] = null
            }

            const task_url = this.state.url
            const user_token = cookie.load('user').token

            patch_task(task_url, task, user_token)
            .then(task => {
                this.setState({
                    text: task.text,
                    deadline: task.deadline ? new Date(task.deadline) : null
                })
            })
            .catch(error => {
                swal(
                    <div>
                        <h1>Error!</h1>        
                        <p>Connection error. Please, try again.</p>
                    </div>
                )
            })
        })
    }

    watchFormText(text){
        this.props.task.text = text
    }

    watchFormDeadline(deadline){
        this.props.task.deadline = deadline
    }

    changePriorityUp(){
        this.changePriority(true)
    }

    changePriorityDown(){
        this.changePriority(false)
    }

    changePriority(up){
        const priority = this.state.priority

        console.log(priority)
        console.log(up)

        this.state.project_move(priority, up)
    }
}

class SweetTaskForm extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            text: props.text,
            deadline: props.deadline ? new Date(props.deadline) : null,

            report_text: props.report_text,
            report_deadline: props.report_deadline
        }

        this.editText = this.editText.bind(this)
        this.editDeadline = this.editDeadline.bind(this)
    }

    render(){
        return(
            <div>
            <input className='form-control taskTextInput' id='sweetTaskText' placeholder='Task text...' 
            defaultValue={this.state.text} onChange={this.editText}/>
            <DatePicker className='projectTaskAddDate' id='sweetTaskDate' dateFormat='dd/MM/yyyy' selected={this.state.deadline}
            placeholderText='day/month/year' onChange={this.editDeadline}/>
        </div>
        );
    }

    editText(){
        const text = document.getElementById('sweetTaskText').value

        this.setState({
            text: text
        })

        this.state.report_text(text === undefined || text === '' ? null : text)
    }

    editDeadline(deadline){
        this.setState({
            deadline: deadline
        })

        this.state.report_deadline(deadline === undefined ? null : deadline)
    }
}