
function send_request(url, method, body = null, headers = {}){

    headers['Content-Type'] = 'application/json'

    return fetch(url, {
        method: method,
        headers: headers,
        mode: 'cors',
        body: body === null ? body : JSON.stringify(body)
    }).then(response => {
        if(!response.ok){
            throw Error()
        }
        
            if(method === 'DELETE'){
                return
            }

            const json = response.json()
            console.log(json)
            return json
    });
}

export function sign_in(login, password){
    const user_data = {
                    username: login,
                    password: password
                };

    const token_url = 'https://yumo2845.pythonanywhere.com/api/token'

    return send_request(token_url, 'POST', user_data)
    .then(data => data.token)
    .catch(error => {throw Error('Wrong username or password!')});
}

export function sign_up(login, password){
    const user_data = {
        username: login,
        password: password
    };

    const users_url = 'https://yumo2845.pythonanywhere.com/api/users/'
    const authorization_token = '3495279158f81e3feb765294d608fb16391a8ab8'

    return send_request(users_url, 'POST', user_data, {'Authorization': 'Token ' + authorization_token})
    .catch(error => {throw Error('User with this username already exists!')});
}

function change_task(task_url, task_data, user_token){
    const header = {'Authorization': 'Token ' + user_token}


    return send_request(task_url, 'PATCH', task_data, header)
    .catch(error => {throw Error('Server error!')});
}

export function change_task_status(task_url, status, user_token){
    const task_data = {
        is_done: status
    }

    return change_task(task_url, task_data, user_token)
    .catch(error => {throw Error('Connection error!')});
}

export function get_projects(user_token){
    const projects_url = 'https://yumo2845.pythonanywhere.com/api/projects/'
    const header = {'Authorization': 'Token ' + user_token}

    return send_request(projects_url, 'GET', null, header)
    .catch(error => {throw Error('Server error!')});
}

export function post_project(user_token, project){
    const projects_url = 'https://yumo2845.pythonanywhere.com/api/projects/'
    const header = {'Authorization': 'Token ' + user_token}

    return send_request(projects_url, 'POST', project, header)
    .catch(error => {throw Error('Server error!')});
}

export function add_task(project_url, user_token, task){
    const add_task_url = project_url + 'add_task/'
    const header = {'Authorization': 'Token ' + user_token}

    return send_request(add_task_url, 'POST', task, header)
    .catch(error => {throw Error('Server error!')});
}

export function patch_project(project_url, user_token, project){
    const header = {'Authorization': 'Token ' + user_token}

    return send_request(project_url, 'PATCH', project, header)
    .catch(error => {throw Error('Server error!')})
}

export function delete_project(project_url, user_token){
    const header = {'Authorization': 'Token ' + user_token}

    return send_request(project_url, 'DELETE', null, header)
    .catch(error => {throw Error('Server error!')})
}

export function delete_task(task_url, user_token){
    const header = {'Authorization': 'Token ' + user_token}

    return send_request(task_url, 'DELETE', null, header)
    .catch(error => {alert('here!')
        throw Error('Server error!')})
}

export function patch_task(task_url, task, user_token){
    const header = {'Authorization': 'Token ' + user_token}

    return send_request(task_url, 'PATCH', task, header)
    .catch(error => {throw Error('Server error!')})
}

export function reprioritize(project_url, priority, up, user_token){
    const reprioritize_url = project_url + 'reprioritize/'
    const header = {'Authorization': 'Token ' + user_token}
    const data = {
        index: priority,
        up: up
    }

    return send_request(reprioritize_url, 'POST', data, header)
    .catch(error => {
        console.log(error)
        throw Error('Server error!')})
}