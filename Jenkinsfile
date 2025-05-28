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
        echo "Installing Chrome and Running Cypress tests with CPU usage tracking..."

        sh '''#!/bin/bash
          # Install dependencies
          apt-get update && apt-get install -y \
            wget gnupg ca-certificates curl \
            xvfb libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 \
            libxtst6 libxrandr2 x11-xkb-utils libglib2.0-0 fonts-liberation libappindicator3-1 \
            time

          # Install latest Google Chrome
          echo "Installing latest Google Chrome..."
          wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
          sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list'
          apt-get update && apt-get install -y google-chrome-stable

          # Link for Cypress to detect
          ln -s /usr/bin/google-chrome /usr/bin/chrome

          mkdir -p cypress/results

          echo "Executing Cypress with CPU tracking via Xvfb..."
          /usr/bin/time -v xvfb-run --auto-servernum --server-args="-screen 0 1920x1080x24" \
            npm run test:ci \
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
