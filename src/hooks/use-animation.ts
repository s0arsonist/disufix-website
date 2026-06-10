"use client"

import { useEffect } from "react"

export function useAnimateOnScroll() {
  useEffect(() => {
    const animateElements = document.querySelectorAll(".animate-on-scroll")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate")
          }
        })
      },
      {
        threshold: 0.1,
      },
    )

    animateElements.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      animateElements.forEach((element) => {
        observer.unobserve(element)
      })
    }
  }, [])
}

export function useAnimateOnLoad() {
  useEffect(() => {
    const animateElements = document.querySelectorAll(".animate-on-load")

    setTimeout(() => {
      animateElements.forEach((element) => {
        element.classList.add("animate")
      })
    }, 100)
  }, [])
}
