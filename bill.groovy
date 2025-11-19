pipeline {
    agent any 

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerkey')
        FLASK_APP_NAME = "aarooon16045/bill-api"
        FLASK_CONTAINER_NAME = "bill-api"
        REACT_CONTAINER_NAME = "bill-frontend"
        DB_USER = credentials('DB_USER')
        DB_PASSWORD = credentials('DB_PASSWORD')
        DB_HOST = credentials('DB_HOST')
        DB_PORT = credentials('DB_PORT')
        DB_NAME = credentials('DB_NAME')
        HASH_KEY = credentials('HASH_KEY')
        SECRET_KEY = credentials('SECRET_KEY')
        REACT_APP_API_HOST = credentials('REACT_HOST')
	    IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    parameters {
        choice(
          name: 'ENV',
          choices: ['dev', 'prod'],
          description: 'Which environment to deploy?'
        )
      }

    stages { 
        stage('SCM Checkout') {
            steps {
                git branch: 'environment-builds',
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
                    echo "DB_HOST=${DB_HOST}" >> .env
                    echo "DB_PORT=${DB_PORT}" >> .env
                    echo "DB_NAME=${DB_NAME}" >> .env
                    echo "HASH_KEY=${HASH_KEY}" >> .env
                    echo "REACT_APP_API_HOST=${REACT_APP_API_HOST}" >> .env
                    echo "SECRET_KEY=${SECRET_KEY}" >> .env
                    echo "REACT_CONTAINER_NAME=${REACT_CONTAINER_NAME}" >> .env
                    """
                }
            }
        }
        stage('Build docker images') {
            steps {  
                sh """
                export IMAGE_TAG=${BUILD_NUMBER}
                docker-compose build ${FLASK_CONTAINER_NAME}
                docker-compose build --no-cache ${REACT_CONTAINER_NAME}
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
                        echo "Using VITE_API_BASE_URL=$VITE_API_BASE_URL"
                        ENV=${ENV} \
                        docker-compose -f docker-compose.yml \
                        -f docker-compose.${ENV}.yml \
                        -p bill-app-${ENV} \
                        up -d --build
                    """
                }
            }
        }
    }
}