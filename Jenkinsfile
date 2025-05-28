pipeline {
  agent any
  tools { nodejs 'Node22' }

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

    stage('Verify Environment') {
      steps {
        sh '''
          echo "Checking Cypress version..."
          npx cypress --version || echo "❌ Cypress not found"

          echo "Listing spec files..."
          find . -name "*.spec.js" || echo "❌ No spec files found"
        '''
      }
    }

    stage('Run Cypress Tests in Chrome') {
  steps {
    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
      script {
        echo "Running Cypress tests with CPU usage tracking..."
        sh '''#!/bin/bash
          # Install GNU time if not already installed
          if ! [ -x /usr/bin/time ]; then
            echo "Installing GNU time..."
            apt-get update && apt-get install -y time
          fi

          mkdir -p cypress/results

          echo "Executing Cypress with CPU tracking..."
          /usr/bin/time -v npm run test:ci \
            > >(tee cypress_output.log) \
            2> >(tee cypress_cpu_usage.txt >&2) || echo "⚠️ Cypress tests failed"

          echo "==== CPU Usage ===="
          grep "Percent of CPU this job got" cypress_cpu_usage.txt || echo "⚠️ CPU usage not found"
        '''
      }
    }
  }
}

    stage('Merge Mochawesome Reports') {
      steps {
        script {
          sh 'mkdir -p cypress/reports'

          def reportFiles = sh(script: "ls cypress/results/mochawesome*.json 2>/dev/null | wc -l", returnStdout: true).trim()
          if (reportFiles != "0") {
            sh 'npx mochawesome-merge cypress/results/mochawesome*.json > cypress/reports/merged-reports.json'
          } else {
            echo "⚠️ No Mochawesome reports found to merge"
            writeFile file: 'cypress/reports/merged-reports.json', text: '{"stats":{},"results":[]}'
          }
        }
      }
    }

    stage('Generate HTML Report') {
      steps {
        script {
          def mergedExists = fileExists('cypress/reports/merged-reports.json')
          if (mergedExists) {
            sh '''#!/bin/bash
              if grep -q '"results":\\[\\]' cypress/reports/merged-reports.json; then
                echo "⚠️ Skipping HTML generation due to empty test results."
              else
                npx mochawesome-report-generator cypress/reports/merged-reports.json --reportDir=cypress/reports --reportFilename test-report.html
              fi
            '''
          } else {
            echo "⚠️ Merged report file not found. Skipping HTML report generation."
          }
        }
      }
    }

    stage('Archive Test Report') {
      steps {
        archiveArtifacts artifacts: 'cypress/reports/**', allowEmptyArchive: true
        archiveArtifacts artifacts: 'cypress_cpu_usage.txt', allowEmptyArchive: true
        archiveArtifacts artifacts: 'cypress_output.log', allowEmptyArchive: true
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
