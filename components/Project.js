import React from 'react'
import './styles/styles.scss'
import Task from './Task'
import { IconContext } from 'react-icons'
import { IoMdCreate } from 'react-icons/io'
import { MdEventNote } from 'react-icons/md'
import { FaRegTrashAlt } from 'react-icons/fa'
import { GoPlus } from "react-icons/go";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from '@sweetalert/with-react';
import { add_task, patch_project, delete_project, reprioritize } from './Requestor'
import cookie from 'react-cookies'


export default class Project extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            key: props.key,

            url: props.project.url,
            name: props.project.name,
            tasks: props.project.tasks,

            main_project_delete: props.main_project_delete,
            is_optional_activated: false,

            deadline: undefined
        }

        this.setNewTaskDeadline = this.setNewTaskDeadline.bind(this)
        this.setOptional = this.setOptional.bind(this)
        this.addTask = this.addTask.bind(this)
        this.editProject = this.editProject.bind(this)
        this.deleteProject = this.deleteProject.bind(this)
        this.deleteTask = this.deleteTask.bind(this)
        this.reprioritizeTasks = this.reprioritizeTasks.bind(this)
    }

    render(){
        return this.display_project()
    }

    display_project(){
        const task_text_id = 'task_text_' + this.state.url
        const date_id = 'date_' + this.state.url

        return(
            <div className='mb-3 projectWrap'>
                <div className='bg-primary text-white card-header projectHead'>
                    <IconContext.Provider value={{color: 'rgb(0, 0, 0, 0.6)'}}>
                        <div className='projectIcon'>
                            <MdEventNote size={30} />
                        </div>
                    </IconContext.Provider>

                    <div className='projectName'>
                        {this.state.name}
                    </div>

                    <div className='projectButtons'>
                        <IconContext.Provider value={{color: 'rgb(255, 255, 255, 0.7)'}}>
                            <div className='projectButton' >
                                <button className='transparentButton' type='button' onClick={this.editProject}><IoMdCreate size={30} /></button>
                            </div>
                            <div className='projectButtonsBorder' />
                            <div className='projectButton'>
                            <button className='transparentButton' type='button' onClick={this.deleteProject}><FaRegTrashAlt size={30} /></button>
                            </div>
                        </IconContext.Provider>
                    </div>
                </div>
                <div className='projectBody'>
                    <div className='projectTaskAddForm'>
                        <div className='projectTaskAddMainForm'>
                            <div className='addTaskOptionalButtonWrap' onClick={this.setOptional}>
                                <IconContext.Provider value={{className: 'addTaskOptionalButton'}}>
                                    <GoPlus size={35} />
                                </IconContext.Provider>
                            </div>

                            <div className='taskInput'>
                                <input className='form-control taskTextInput' id={task_text_id} placeholder='Start typing here to create a task...'></input>
                                <button type="button" className="addTaskButton" onClick={this.addTask}>Add task</button>
                            </div>
                        </div>

                        {this. state.is_optional_activated &&
                        <div className='projectTaskAddOptionalForm'>
                            <DatePicker className='projectTaskAddDate' id={date_id} dateFormat='dd/MM/yyyy' onChange={this.setNewTaskDeadline} 
                            selected={this.state.deadline} placeholderText='day/month/year'/>
                        </div>}
                    </div>

                    {this.state.tasks.map((task, index) =>(
                        <Task key={task.url} task={task} project_delete_task={this.deleteTask}
                        project_move={this.reprioritizeTasks}/>
                    ))}
                </div>
            </div>
        );
    }

    setNewTaskDeadline(date){
        this.setState({
            deadline: date
            })
    }

    setOptional(){
        this.setState({
            is_optional_activated: !this.state.is_optional_activated,
            deadline: undefined
        })
    }

    addTask(){
        const text = document.getElementById('task_text_' + this.state.url).value
        const deadline = this.state.deadline

        document.getElementById('task_text_' + this.state.url).value = ''
        this.setState({
            deadline: undefined
        })

        if(!text){
            swal(
                {
                    title: 'Error',
                    text: 'Task text must not be empty!'
                }
            )

            return
        }

        const project_url = this.state.url
        const user_token = cookie.load('user').token
        const task = {
            text: text
        }

        if(deadline){
            const day = deadline.getDate()
            const month = deadline.getMonth() + 1
            const year = deadline.getFullYear()

            task['deadline'] = year + '-' + month + '-' + day
        }

        add_task(project_url, user_token, task)
        .then(project => {
            this.setState({
                url: project.url,
                name: project.name,
                tasks: project.tasks
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
    }

    editProject(){
        swal({
            text: "Project name",
            content: "input",
           button: {
            text: "Edit Project",
            value: 'edit_project',
            closeModal: true
          } 
        }).then(project_name =>{
            if(!project_name){
                return
            }

            const project_url = this.state.url
            const user_token = cookie.load('user').token
            const project = {
                name: project_name
            }

            patch_project(project_url, user_token, project)
            .then( project => {
                this.setState({
                    name: project.name
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

    deleteProject(){
        const project_url = this.state.url
        const user_token = cookie.load('user').token

        delete_project(project_url, user_token)
        .then(() =>{
            this.state.main_project_delete(project_url)
        })
        .catch(error => {
            swal(
                <div>
                    <h1>Error!</h1>        
                    <p>Connection error. Please, try again.</p>
                </div>
            )
        })
    }

    deleteTask(url){
        const old_tasks = this.state.tasks
        const new_tasks = old_tasks.filter(task => task.url !== url)

        this.setState({
            tasks: new_tasks
        })
    }

    reprioritizeTasks(priority, up){
        const project_url = this.state.url
        const user_token = cookie.load('user').token

        reprioritize(project_url, priority, up, user_token)
        .then(project => {
            this.setState({
                tasks: []
            })

            this.setState({
                tasks: project.tasks
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
    }
}