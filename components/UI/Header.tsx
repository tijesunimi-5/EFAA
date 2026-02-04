"use client"
import { Activity, Menu, Search, Users, X } from 'lucide-react'
import React, { useState } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100" >
        <div className="flex items-center gap-2">
          <div className="bg-teal-700 p-1.5 rounded-lg shadow-sm">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="font-black tracking-tighter text-teal-800 text-xl uppercase">EFAA</span>
        </div>
        <div className="navigations justify-between w-100 hidden lg:flex lg:gap-8 lg:text-sm lg:font-medium lg:text-slate-700">
          <a href='#' className='hover:text-teal-300 cursor-pointer transition-all duration-200 ease-in'>My Profile</a>
          <a href='#' className='hover:text-teal-300 cursor-pointer transition-all duration-200 ease-in'>Search Topics</a>
          <a href='#' className='hover:text-teal-300 cursor-pointer transition-all duration-200 ease-in'>Join Community</a>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors lg:hidden"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header >

      {/* --- Mobile Menu Overlay --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16.25 bg-white z-40 p-6 animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-6 text-lg font-semibold text-slate-700">
            <a href="#" className="flex items-center gap-3"><Activity className="w-5 h-5 text-teal-600" /> My Profile</a>
            <a href="/search" className="flex items-center gap-3"><Search className="w-5 h-5 text-teal-600" /> Search Topics</a>
            <a href="#" className="flex items-center gap-3"><Users className="w-5 h-5 text-teal-600" /> Join Community</a>
            <div className="h-px bg-slate-100 my-2" />
            <a href="#" className="text-rose-600">Report an Issue</a>
          </nav>
        </div>
      )}
    </>
  )
}

export default Header
