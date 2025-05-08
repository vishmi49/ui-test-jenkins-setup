pipeline {
  agent {
    docker {
      image 'cypress/browsers:node-22.0.0-chrome-122.0.6261.94-1-ff-123.0-edge-122.0.2365.92-1'
      args '-u root' 
    }
  }

  environment {
    CI = 'true'
  }

  stages {

    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Run Cypress Tests in Chrome') {
      steps {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          sh 'npm run test:ci'
        }
      }
    }

    stage('Merge Mochawesome Reports') {
      steps {
        sh '''
          mkdir -p cypress/results
          npx mochawesome-merge cypress/results/*.json > cypress/results/merged-reports.json || echo "No reports to merge"
        '''
      }
    }

    stage('Generate HTML Report') {
      steps {
        sh 'npx mochawesome-report-generator cypress/results/merged-reports.json --reportDir cypress/results --reportFilename test-report.html'
      }
    }

    stage('Archive Test Report') {
      steps {
        archiveArtifacts artifacts: 'cypress/results/**', allowEmptyArchive: true
      }
    }
  }

  post {
    always {
      echo 'Pipeline finished.'
    }
  }
}
