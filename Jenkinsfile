pipeline {
    agent any
    environment {
        FRONTEND_IMAGE = "ramirachdi/booking-frontend"
        BACKEND_IMAGE = "ramirachdi/booking-backend"
    }
    stages {
        stage('Clone Repository') {
            steps {
                // Cloning the BookingDeployment repository
                git branch: 'main', credentialsId: 'githubtoken', url: 'https://github.com/ramirachdi/BookingDeployment.git'
            }
        }
        stage('Build Frontend') {
            steps {
                script {
                    dir('BookingFrontend') {
                        // Ensure Docker Pipeline plugin is installed and Docker is correctly configured
                        docker.build("${FRONTEND_IMAGE}:${env.BUILD_ID}")
                    }
                }
            }
        }
        stage('Push Frontend') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-frontend') {
                        docker.image("${FRONTEND_IMAGE}:${env.BUILD_ID}").push()
                    }
                }
            }
        }
        stage('Build Backend') {
            steps {
                script {
                    dir('BookingBackend') {
                        docker.build("${BACKEND_IMAGE}:${env.BUILD_ID}")
                    }
                }
            }
        }
        stage('Push Backend') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-backend') {
                        docker.image("${BACKEND_IMAGE}:${env.BUILD_ID}").push()
                    }
                }
            }
        }
    }
}
