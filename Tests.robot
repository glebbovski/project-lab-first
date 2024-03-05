*** Test Cases ***
*** Settings ***
Library    RequestsLibrary
Library    Collections

*** Variables ***
${api_url}    http://127.0.0.1:8000/


*** Test Cases ***
Test Simple Login And Logout
    [Tags]    LOGIN_LOGOUT
    ${json}    Create Dictionary    email=qqq@gmail.com    password=qwertyqwerty
    ${response}    POST    ${api_url}api/token/    json=${json}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    access
    Should Contain    ${keys_list}    refresh
    ${access_token}    Set Variable    ${json['access']}
    ${refresh_token}    Set Variable    ${json['refresh']}
    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${json_with_refresh}    Create Dictionary    refresh=${refresh_token}
    ${response}    POST    ${api_url}api/logout/    json=${json_with_refresh}    headers=${headers}
    Status Should Be    200    ${response}
    Should Be Equal As Strings    ${response.json()['status']}    blacklisted

Test Simple Login And Logout With Refresh Token
    [Tags]    LOGIN_LOGOUT_REFRESH
    ${json}    Create Dictionary    email=qqq@gmail.com    password=qwertyqwerty
    ${response}    POST    ${api_url}api/token/    json=${json}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    access
    Should Contain    ${keys_list}    refresh
    ${refresh_token}    Set Variable    ${json['refresh']}
    ${json}    Create Dictionary    refresh=${refresh_token}
    ${response}    POST    ${api_url}api/token/refresh/    json=${json}
    Status Should Be    200    ${response}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    access
    Should Contain    ${keys_list}    refresh
    ${access_token}    Set Variable    ${json['access']}
    ${refresh_token}    Set Variable    ${json['refresh']}
    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${json_with_refresh}    Create Dictionary    refresh=${refresh_token}
    ${response}    POST    ${api_url}api/logout/    json=${json_with_refresh}    headers=${headers}
    Status Should Be    200    ${response}
    Should Be Equal As Strings    ${response.json()['status']}    blacklisted

Test Get About Information
    [Tags]    ABOUT
    ${json}    Create Dictionary    email=qqq@gmail.com    password=qwertyqwerty
    ${response}    POST    ${api_url}api/token/    json=${json}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    access
    Should Contain    ${keys_list}    refresh
    ${access_token}    Set Variable    ${json['access']}
    ${refresh_token}    Set Variable    ${json['refresh']}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${response}    GET    ${api_url}api/about/    headers=${headers}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    creator
    Should Contain    ${keys_list}    about_project
    Should Contain    ${keys_list}    born_city

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${json_with_refresh}    Create Dictionary    refresh=${refresh_token}
    ${response}    POST    ${api_url}api/logout/    json=${json_with_refresh}    headers=${headers}
    Status Should Be    200    ${response}
    Should Be Equal As Strings    ${response.json()['status']}    blacklisted

Test Get List Of Users
    [Tags]    LIST_OF_USERS
    ${json}    Create Dictionary    email=qqq@gmail.com    password=qwertyqwerty
    ${response}    POST    ${api_url}api/token/    json=${json}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    access
    Should Contain    ${keys_list}    refresh
    ${access_token}    Set Variable    ${json['access']}
    ${refresh_token}    Set Variable    ${json['refresh']}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${response}    GET    ${api_url}api/users/    headers=${headers}
    Status Should Be    200    ${response}
    Log    ${response.json()}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${json_with_refresh}    Create Dictionary    refresh=${refresh_token}
    ${response}    POST    ${api_url}api/logout/    json=${json_with_refresh}    headers=${headers}
    Status Should Be    200    ${response}
    Should Be Equal As Strings    ${response.json()['status']}    blacklisted

Test Get List Of Courses
    [Tags]    LIST_OF_COURSES
    ${json}    Create Dictionary    email=qqq@gmail.com    password=qwertyqwerty
    ${response}    POST    ${api_url}api/token/    json=${json}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    access
    Should Contain    ${keys_list}    refresh
    ${access_token}    Set Variable    ${json['access']}
    ${refresh_token}    Set Variable    ${json['refresh']}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${response}    GET    ${api_url}api/courses/    headers=${headers}
    Status Should Be    200    ${response}
    Log    ${response.json()}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${json_with_refresh}    Create Dictionary    refresh=${refresh_token}
    ${response}    POST    ${api_url}api/logout/    json=${json_with_refresh}    headers=${headers}
    Status Should Be    200    ${response}
    Should Be Equal As Strings    ${response.json()['status']}    blacklisted

Test Get List Of Questions
    [Tags]    LIST_OF_QUESTIONS
    ${json}    Create Dictionary    email=qqq@gmail.com    password=qwertyqwerty
    ${response}    POST    ${api_url}api/token/    json=${json}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    access
    Should Contain    ${keys_list}    refresh
    ${access_token}    Set Variable    ${json['access']}
    ${refresh_token}    Set Variable    ${json['refresh']}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${response}    GET    ${api_url}api/questions/    headers=${headers}
    Status Should Be    200    ${response}
    Log    ${response.json()}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${json_with_refresh}    Create Dictionary    refresh=${refresh_token}
    ${response}    POST    ${api_url}api/logout/    json=${json_with_refresh}    headers=${headers}
    Status Should Be    200    ${response}
    Should Be Equal As Strings    ${response.json()['status']}    blacklisted

Test Get List Of Answers
    [Tags]    LIST_OF_ANSWERS
    ${json}    Create Dictionary    email=qqq@gmail.com    password=qwertyqwerty
    ${response}    POST    ${api_url}api/token/    json=${json}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    access
    Should Contain    ${keys_list}    refresh
    ${access_token}    Set Variable    ${json['access']}
    ${refresh_token}    Set Variable    ${json['refresh']}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${response}    GET    ${api_url}api/answers/    headers=${headers}
    Status Should Be    200    ${response}
    Log    ${response.json()}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${json_with_refresh}    Create Dictionary    refresh=${refresh_token}
    ${response}    POST    ${api_url}api/logout/    json=${json_with_refresh}    headers=${headers}
    Status Should Be    200    ${response}
    Should Be Equal As Strings    ${response.json()['status']}    blacklisted

Test Get List Of Enrollments
    [Tags]    LIST_OF_ENROLLMENTS
    ${json}    Create Dictionary    email=qqq@gmail.com    password=qwertyqwerty
    ${response}    POST    ${api_url}api/token/    json=${json}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    access
    Should Contain    ${keys_list}    refresh
    ${access_token}    Set Variable    ${json['access']}
    ${refresh_token}    Set Variable    ${json['refresh']}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${response}    GET    ${api_url}api/enrollment/    headers=${headers}
    Status Should Be    200    ${response}
    Log    ${response.json()}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${json_with_refresh}    Create Dictionary    refresh=${refresh_token}
    ${response}    POST    ${api_url}api/logout/    json=${json_with_refresh}    headers=${headers}
    Status Should Be    200    ${response}
    Should Be Equal As Strings    ${response.json()['status']}    blacklisted

Test Register And Delete New User
    [Tags]    REGISTER_AND_DELETE_NEW_USER
    ${json}    Create Dictionary    first_name=first_robot    last_name=last_robot    username=username_robot
    ...    email=robot@example.com    password=robotrobotqwertyqwerty    password2=robotrobotqwertyqwerty
    ...    sex=M    date_of_birth=1998-08-08
    ${response}    POST    ${api_url}api/register/    json=${json}
    Status Should Be    201    ${response}
    Log    ${response.json()}
    Should Be Equal As Strings    ${response.json()['first_name']}    first_robot
    Should Be Equal As Strings    ${response.json()['last_name']}    last_robot
    Should Be Equal As Strings    ${response.json()['username']}    username_robot
    Should Be Equal As Strings    ${response.json()['email']}    robot@example.com
    Should Be Equal As Strings    ${response.json()['sex']}    M
    Should Be Equal As Strings    ${response.json()['date_of_birth']}    1998-08-08

    ${id}    Set Variable    ${response.json()['id']}

    ${json}    Create Dictionary    email=robot@example.com    password=robotrobotqwertyqwerty
    ${response}    POST    ${api_url}api/token/    json=${json}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    access
    Should Contain    ${keys_list}    refresh
    ${access_token}    Set Variable    ${json['access']}
    ${refresh_token}    Set Variable    ${json['refresh']}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${response}    DELETE    ${api_url}api/users/${id}/    headers=${headers}
    Status Should Be    204    ${response}

    # non need to logout because 'body={"detail":"User not found","code":"user_not_found"}'
#    ${json_with_refresh}    Create Dictionary    refresh=${refresh_token}
#    ${response}    POST    ${api_url}api/logout/    json=${json_with_refresh}    headers=${headers}
#    Status Should Be    200    ${response}
#    Should Be Equal As Strings    ${response.json()['status']}    blacklisted

Test Get User Info By Refresh Token
    [Tags]    GET_INFO_BY_TOKEN
    ${json}    Create Dictionary    email=qqq@gmail.com    password=qwertyqwerty
    ${response}    POST    ${api_url}api/token/    json=${json}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    access
    Should Contain    ${keys_list}    refresh
    ${access_token}    Set Variable    ${json['access']}
    ${refresh_token}    Set Variable    ${json['refresh']}

    ${response}    GET    ${api_url}api/get_info_by_token/${refresh_token}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    Should Be Equal As Strings    ${response.json()['email']}    qqq@gmail.com
    Should Be Equal As Strings    ${response.json()['username']}    glepka

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${json_with_refresh}    Create Dictionary    refresh=${refresh_token}
    ${response}    POST    ${api_url}api/logout/    json=${json_with_refresh}    headers=${headers}
    Status Should Be    200    ${response}
    Should Be Equal As Strings    ${response.json()['status']}    blacklisted


Test Register User -> Change Info -> Delete User
    [Tags]    CHANGE_USER_INFO
    ${json}    Create Dictionary    first_name=first_robot    last_name=last_robot    username=username_robot
    ...    email=robot@example.com    password=robotrobotqwertyqwerty    password2=robotrobotqwertyqwerty
    ...    sex=M    date_of_birth=1998-08-08
    ${response}    POST    ${api_url}api/register/    json=${json}
    Status Should Be    201    ${response}
    Log    ${response.json()}
    Should Be Equal As Strings    ${response.json()['first_name']}    first_robot
    Should Be Equal As Strings    ${response.json()['last_name']}    last_robot
    Should Be Equal As Strings    ${response.json()['username']}    username_robot
    Should Be Equal As Strings    ${response.json()['email']}    robot@example.com
    Should Be Equal As Strings    ${response.json()['sex']}    M
    Should Be Equal As Strings    ${response.json()['date_of_birth']}    1998-08-08

    ${id}    Set Variable    ${response.json()['id']}

    ${json}    Create Dictionary    email=robot@example.com    password=robotrobotqwertyqwerty
    ${response}    POST    ${api_url}api/token/    json=${json}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    access
    Should Contain    ${keys_list}    refresh
    ${access_token}    Set Variable    ${json['access']}
    ${refresh_token}    Set Variable    ${json['refresh']}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${info_to_change}    Create Dictionary    first_name=changed_robot_firstname    last_name=changed_robot_lastname
    ${response}    PATCH    ${api_url}api/users/${id}/    headers=${headers}    json=${info_to_change}
    Status Should Be    200    ${response}
    Should Be Equal As Strings    ${response.json()['first_name']}    changed_robot_firstname
    Should Be Equal As Strings    ${response.json()['last_name']}    changed_robot_lastname

    ${response}    DELETE    ${api_url}api/users/${id}/    headers=${headers}
    Status Should Be    204    ${response}

    # non need to logout because 'body={"detail":"User not found","code":"user_not_found"}'
#    ${json_with_refresh}    Create Dictionary    refresh=${refresh_token}
#    ${response}    POST    ${api_url}api/logout/    json=${json_with_refresh}    headers=${headers}
#    Status Should Be    200    ${response}
#    Should Be Equal As Strings    ${response.json()['status']}    blacklisted

Test Get Previous Result
    [Tags]    GET_PREVIOUS_RESULT
    ${json}    Create Dictionary    email=qqq@gmail.com    password=qwertyqwerty
    ${response}    POST    ${api_url}api/token/    json=${json}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${json}    Convert To Dictionary    ${response.json()}
    ${keys_list}    Get Dictionary Keys    ${json}
    Should Contain    ${keys_list}    access
    Should Contain    ${keys_list}    refresh
    ${access_token}    Set Variable    ${json['access']}
    ${refresh_token}    Set Variable    ${json['refresh']}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${params}    Create Dictionary    user=2   course=4
    ${response}    GET    ${api_url}api/previousresult/    headers=${headers}    params=${params}
    Status Should Be    200    ${response}
    Log    ${response.json()}
    ${length}    Get Length    ${response.json()}
    Should Be Equal As Integers    ${length}    ${1}

    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${access_token}
    ${json_with_refresh}    Create Dictionary    refresh=${refresh_token}
    ${response}    POST    ${api_url}api/logout/    json=${json_with_refresh}    headers=${headers}
    Status Should Be    200    ${response}
    Should Be Equal As Strings    ${response.json()['status']}    blacklisted
