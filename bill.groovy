pipeline {
    agent any 

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerkey')
        FLASK_APP_NAME = "aarooon16045/bill-app"
        FLASK_CONTAINER_NAME = "bill-app"
        DB_USER = credentials('DB_USER')
        DB_PASSWORD = credentials('DB_PASSWORD')
        DB_HOST = credentials('DB_HOST')
        DB_PORT = credentials('DB_PORT')
        DB_NAME = credentials('DB_NAME')
	    IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages { 
        stage('SCM Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'git-key',
                    url: 'git@github.com:aaronesposito/bill-app.git'
            }
        }
        stage('Create .env File') {
            steps {
                script {
                    sh """
                    echo "DB_USER=${DB_USER}" > .env
                    echo "DB_PASSWORD=${DB_PASSWORD}" >> .env
                    echo "DB_ADMIN_EMAIL=${DB_ADMIN_EMAIL}" >> .env
                    echo "DB_ADMIN_PASSWORD=${DB_ADMIN_PASSWORD}" >> .env
                    echo "DB_HOST=${DB_HOST}" >> .env
                    echo "DB_PORT=${DB_PORT}" >> .env
                    echo "DB_NAME=${DB_NAME}" >> .env
                    """
                }
            }
        }
        stage('Build docker images') {
            steps {  
                sh """
                export IMAGE_TAG=${BUILD_NUMBER}
                docker-compose build flask-app
                """
            }
        }
        
        stage('login to dockerhub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }
        
         stage('push image') {
            steps {
                sh """
                docker tag $FLASK_APP_NAME $FLASK_APP_NAME:$BUILD_NUMBER
                docker push $FLASK_APP_NAME:$BUILD_NUMBER
                """
            }
        }
    
        stage('Deploy to Server') {
            steps {
                script {
                    sh """
                    docker-compose down
                    docker pull ${FLASK_APP_NAME}:${BUILD_NUMBER}
                    docker-compose up -d
                    """
                }
            }
        }
    }
}