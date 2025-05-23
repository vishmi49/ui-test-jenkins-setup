pipeline {
  agent any
  tools {nodejs 'Node22'}
  
  environment {
       CHROME_BIN = '/bin/google-chrome'
      
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
        script {
          sh 'mkdir -p cypress/reports'

          def reportFiles = sh(script: "ls cypress/results/mochawesome*.json 2>/dev/null | wc -l", returnStdout: true).trim()
          if (reportFiles != "0") {
            sh '''
              npx mochawesome-merge cypress/results/mochawesome*.json > cypress/reports/merged-reports.json
            '''
          } else {
            echo "⚠️ No Mochawesome reports found to merge"
            writeFile file: 'cypress/reports/merged-reports.json', text: '{}'
          }
        }
      }
    }

    stage('Generate HTML Report') {
      steps {
        script {
          def mergedExists = fileExists('cypress/reports/merged-reports.json')
          if (mergedExists) {
            sh 'npx mochawesome-report-generator cypress/reports/merged-reports.json --reportDir cypress/reports --reportFilename test-report.html'
          } else {
            echo "⚠️ Merged report file not found. Skipping HTML report generation."
          }
        }
      }
    }

    stage('Archive Test Report') {
      steps {
        archiveArtifacts artifacts: 'cypress/reports/**', allowEmptyArchive: true

      }
    }

     stage('Cleanup Results Directory') {
      steps {
        sh 'rm -rf cypress/results/mochawesome*.json || echo "Nothing to clean."'
      }
    }
  }

  post {
    always {
      echo 'Pipeline finished.'
    }
  }
}