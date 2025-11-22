'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@kiaan/ui'
import { CreditCard, Check, X, AlertCircle, Wifi, Battery, Signal, Lock, Receipt, Calculator } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

type TransactionState = 'idle' | 'amount' | 'card' | 'pin' | 'processing' | 'success' | 'error'

export default function POSTerminal() {
  const [state, setState] = useState<TransactionState>('idle')
  const [amount, setAmount] = useState('')
  const [pin, setPin] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const terminal = {
    id: 'TRM-001',
    serialNumber: 'KPN-2024-001-KLA',
    merchant: 'Nakumatt Supermarket',
    location: 'Garden City, Kampala',
  }

  const handleNumberInput = (num: string) => {
    if (state === 'amount') {
      setAmount(prev => prev + num)
    } else if (state === 'pin') {
      if (pin.length < 4) {
        setPin(prev => prev + num)
      }
    }
  }

  const handleClear = () => {
    if (state === 'amount') {
      setAmount('')
    } else if (state === 'pin') {
      setPin('')
    }
  }

  const handleBackspace = () => {
    if (state === 'amount') {
      setAmount(prev => prev.slice(0, -1))
    } else if (state === 'pin') {
      setPin(prev => prev.slice(0, -1))
    }
  }

  const handleStartTransaction = () => {
    setState('amount')
    setAmount('')
  }

  const handleAmountConfirm = () => {
    if (parseFloat(amount) > 0) {
      setState('card')
    }
  }

  const simulateCardTap = () => {
    setCardNumber('KPN-2024-5678')
    setState('pin')
    setPin('')
  }

  const handlePinSubmit = () => {
    if (pin.length === 4) {
      setState('processing')
      // Simulate processing
      setTimeout(() => {
        // Random success/failure for demo
        const success = Math.random() > 0.1
        if (success) {
          setState('success')
          setTimeout(() => {
            setState('idle')
            setAmount('')
            setPin('')
            setCardNumber('')
          }, 3000)
        } else {
          setErrorMessage('Insufficient balance')
          setState('error')
          setTimeout(() => {
            setState('idle')
            setAmount('')
            setPin('')
            setCardNumber('')
            setErrorMessage('')
          }, 3000)
        }
      }, 2000)
    }
  }

  const handleCancel = () => {
    setState('idle')
    setAmount('')
    setPin('')
    setCardNumber('')
    setErrorMessage('')
  }

  return (
    <div className="flex h-screen flex-col bg-gray-900">
      {/* Status Bar */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-black px-6 py-3 text-white">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-sm font-medium">Terminal {terminal.serialNumber}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Wifi className="h-4 w-4" />
          <Signal className="h-4 w-4" />
          <Battery className="h-4 w-4" />
          <span className="font-mono">14:32</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Merchant Info */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">{terminal.merchant}</h1>
            <p className="text-gray-400">{terminal.location}</p>
          </div>

          {/* Display Area */}
          <div className="mb-8 rounded-2xl border-2 border-gray-800 bg-gray-950 p-8">
            <AnimatePresence mode="wait">
              {state === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <CreditCard className="mx-auto mb-4 h-16 w-16 text-gray-600" />
                  <p className="mb-6 text-2xl font-medium text-gray-400">Ready for Transaction</p>
                  <button
                    onClick={handleStartTransaction}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-12 py-4 text-xl font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/50"
                  >
                    New Transaction
                  </button>
                </motion.div>
              )}

              {state === 'amount' && (
                <motion.div
                  key="amount"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <p className="mb-2 text-center text-sm uppercase tracking-wide text-gray-500">Enter Amount</p>
                  <div className="mb-6 text-center">
                    <span className="text-6xl font-bold text-white">
                      UGX {amount || '0'}
                    </span>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleCancel}
                      className="rounded-lg border border-gray-700 bg-gray-800 px-8 py-3 font-medium text-white hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAmountConfirm}
                      disabled={!amount || parseFloat(amount) <= 0}
                      className="rounded-lg bg-green-600 px-8 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {state === 'card' && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center"
                >
                  <p className="mb-2 text-sm uppercase tracking-wide text-gray-500">Amount</p>
                  <p className="mb-6 text-4xl font-bold text-white">UGX {amount}</p>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600"
                  >
                    <CreditCard className="h-16 w-16 text-white" />
                  </motion.div>
                  <p className="mb-4 text-2xl font-medium text-white">Tap Card to Pay</p>
                  <button
                    onClick={simulateCardTap}
                    className="mb-4 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700"
                  >
                    Simulate Card Tap
                  </button>
                  <button
                    onClick={handleCancel}
                    className="block mx-auto text-sm text-gray-400 hover:text-white"
                  >
                    Cancel Transaction
                  </button>
                </motion.div>
              )}

              {state === 'pin' && (
                <motion.div
                  key="pin"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <p className="mb-2 text-sm uppercase tracking-wide text-gray-500">Card Detected</p>
                  <p className="mb-6 font-mono text-xl text-gray-400">{cardNumber}</p>
                  <p className="mb-4 text-2xl font-medium text-white">Enter PIN</p>
                  <div className="mb-6 flex justify-center gap-3">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-4 w-4 rounded-full border-2 transition-colors ${
                          i < pin.length
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-600 bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleCancel}
                      className="rounded-lg border border-gray-700 bg-gray-800 px-8 py-3 font-medium text-white hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePinSubmit}
                      disabled={pin.length !== 4}
                      className="rounded-lg bg-green-600 px-8 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Submit
                    </button>
                  </div>
                </motion.div>
              )}

              {state === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500" />
                  <p className="text-2xl font-medium text-white">Processing Payment...</p>
                  <p className="mt-2 text-gray-400">Please wait</p>
                </motion.div>
              )}

              {state === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500"
                  >
                    <Check className="h-12 w-12 text-white" strokeWidth={3} />
                  </motion.div>
                  <p className="mb-2 text-3xl font-bold text-green-500">Payment Successful!</p>
                  <p className="text-xl text-gray-400">UGX {amount}</p>
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Receipt className="h-4 w-4" />
                    <span>Receipt printed</span>
                  </div>
                </motion.div>
              )}

              {state === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500"
                  >
                    <X className="h-12 w-12 text-white" strokeWidth={3} />
                  </motion.div>
                  <p className="mb-2 text-3xl font-bold text-red-500">Payment Failed</p>
                  <p className="text-xl text-gray-400">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Keypad */}
          {(state === 'amount' || state === 'pin') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-4"
            >
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '←'].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'C') handleClear()
                    else if (key === '←') handleBackspace()
                    else handleNumberInput(key)
                  }}
                  className="rounded-xl border-2 border-gray-800 bg-gray-900 py-6 text-2xl font-semibold text-white transition-all hover:border-blue-600 hover:bg-gray-800 active:scale-95"
                >
                  {key}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 bg-black px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Lock className="h-4 w-4" />
          <span>Secure Connection • Encrypted End-to-End</span>
        </div>
      </div>
    </div>
  )
}
