import React from 'react'
import cookie from 'react-cookies'
import {
    Redirect,
    Link
  } from "react-router-dom"
import './styles/styles.scss'
import Project from './Project'
import {get_projects} from './Requestor'
import { IconContext } from 'react-icons'
import { IoMdExit } from 'react-icons/io'
import { GoPlus } from "react-icons/go";
import swal from '@sweetalert/with-react';
import { post_project } from './Requestor'


export default class Main extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            projects: undefined,
            is_loaded: false,
            loading_error: false
        }

        this.load_projects = this.load_projects.bind(this)
        this.addProject = this.addProject.bind(this)
        this.postProject = this.postProject.bind(this)
        this.deleteProject = this.deleteProject.bind(this)
    }

    render(){
        if(!cookie.load('user')){
           return this.redirect_to_authorization()
        }
        
        const is_loading_error = this.state.loading_error
        if(is_loading_error){
            return(
                <div />
            );
        }

        const is_loaded = this.state.is_loaded
        if(is_loaded){
            return this.display_main()
        }
        
        return(
            <div />
        );
    }

    componentDidMount(){
        if(!this.state.is_loaded && cookie.load('user') !== undefined){
            this.load_projects()
        }
    }

    redirect_to_authorization(){
        return(
            <Redirect to='/authorization' />
        );
    }

    display_main(){
        const username = cookie.load('user').username

        return(
            <div>
                <nav className='navbar navbar-dark text-white bg-primary myNavBar'>
                    <div className='logo'> 
                        TODO List
                    </div>

                    <div className='user'>
                        {username}
                    </div>

                    <div className='exit'>
                        <Link className='text-white exitLink' to='/authorization' onClick={this.delete_cookies}>
                            <div className='text-white'>
                                Sign out
                            </div>

                            <div>
                                <IconContext.Provider value={{className: 'exitIcon'}}>
                                    <IoMdExit size={30} />
                                </IconContext.Provider>
                            </div>
                        </Link>
                    </div>
                </nav>

                <div>
                    {this.state.projects.map((project, index) =>(
                        <Project key={project.url} project={project} main_project_delete={this.deleteProject} />
                    ))}
                </div>

                <div className='addProjectButtonWrap'>
                <button type="button" className='btn btn-primary btn-lg addProjectButton' onClick={this.addProject}>
                        <IconContext.Provider value={{className: 'plusIcon'}}>
                            <GoPlus size={25} />
                        </IconContext.Provider>
                        Add TODO List
                    </button>
                </div>
            </div>
        );
    }

    delete_cookies(){
        cookie.remove('user')
    }

    load_projects(){
        const user_token = cookie.load('user').token

        get_projects(user_token)
        .then(projects => {

            this.setState({
                projects: projects,
                is_loaded: true
            })
        })
        .catch(error => {
            this.setState({
                loading_error: true,
                is_loaded: true
            })
            swal(
                <div>
                    <h1>Error!</h1>        
                    <p>Connection error. Please, reload a page.</p>
                </div>
            )
        })
    }

    addProject(){
        swal({
            text: "Project name",
            closeOnClickOutside: true,
            content: {
                  element: "input",
                  attributes: {
                  placeholder: "Enter new project name"
                }
            },
            button: {
            text: "Add Project",
            closeModal: true
            }
        }).then(project_name => {
            if(!project_name){

                return
            }
            
            this.postProject(project_name)
        })
    }

    postProject(project_name){
        const project = {
            name: project_name
        }
        const user_token = cookie.load('user').token

        post_project(user_token, project)
        .then(project =>{
            const new_projects = this.state.projects
            new_projects.push(project)

            this.setState({
                projects: new_projects
            })
        }).catch(error => {
            swal(
                <div>
                    <h1>Error!</h1>        
                    <p>Connection error. Please, try again.</p>
                </div>
            )
        })
    }

    deleteProject(url){
        const old_projects = this.state.projects

        const new_projects = old_projects.filter(project => project.url !== url)

        this.setState({
            projects: new_projects
        })
    }
}