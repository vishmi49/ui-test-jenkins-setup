pipeline {
  agent any
  tools { nodejs 'Node22' }

  environment {
    CHROME_BIN = '/usr/bin/google-chrome'
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

    stage('Install Chromium & Dependencies') {
      steps {
        sh '''#!/bin/bash
          echo "Installing Chromium and required dependencies..."

          apt-get update && apt-get install -y \
            chromium chromium-driver \
            libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 \
            libxss1 libasound2 libxtst6 libxrandr2 x11-xkb-utils libglib2.0-0 \
            fonts-liberation libatk-bridge2.0-0 libatk1.0-0 libatspi2.0-0 \
            libpango-1.0-0 libudev1 libxcomposite1 libxdamage1 libxext6 \
            libxfixes3 libxkbcommon0 xvfb time

          # Create a symlink for Chromium to mimic Google Chrome
          ln -sf /usr/bin/chromium /usr/bin/google-chrome
        '''
      }
    }

    stage('Verify Environment') {
      steps {
        sh '''
          echo "Checking Cypress version..."
          npx cypress --version || echo "❌ Cypress not found"

          echo "Listing spec files..."
          find . -name "*.spec.js" || echo "❌ No spec files found"

          echo "Google Chrome (Chromium) version:"
          google-chrome --version || echo "❌ Chrome not found"
        '''
      }
    }

    stage('Run Cypress Tests in Chrome') {
      steps {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          script {
            echo "Running Cypress tests with CPU usage tracking..."
            sh '''#!/bin/bash
              mkdir -p cypress/results

              echo "Executing Cypress with CPU tracking..."
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
