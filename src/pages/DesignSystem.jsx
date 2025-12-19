import { useState } from "react";
import {
  Button,
  Input,
  Label,
  FormField,
  H1,
  H2,
  H3,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Alert,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Select,
  Grid,
  PageHeader,
  Section,
  Container,
} from "@/components/ui";

export default function DesignSystem() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-100 min-h-screen">
      <H1>Design System — Deep Purple + Mint</H1>

      {/* Colors */}
      <section className="mb-12">
        <H2>Color Palette</H2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Purple Shades */}
          <div className="p-4 rounded-xl bg-primary-darker text-white text-center">
            Purple 900
          </div>
          <div className="p-4 rounded-xl bg-primary-dark text-white text-center">
            Purple 700
          </div>
          <div className="p-4 rounded-xl bg-primary text-white text-center">
            Purple 500
          </div>
          <div className="p-4 rounded-xl bg-primary-light text-gray-900 text-center">
            Purple 300
          </div>
          <div className="p-4 rounded-xl bg-primary-lighter text-gray-900 text-center">
            Purple 100
          </div>

          {/* Mint */}
          <div className="p-4 rounded-xl bg-accent-darker text-white text-center">
            Mint 900
          </div>
          <div className="p-4 rounded-xl bg-accent-dark text-white text-center">
            Mint 700
          </div>
          <div className="p-4 rounded-xl bg-accent text-white text-center">
            Mint 500
          </div>
          <div className="p-4 rounded-xl bg-accent-light text-gray-900 text-center">
            Mint 300
          </div>
          <div className="p-4 rounded-xl bg-accent-lighter text-gray-900 text-center">
            Mint 100
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-12">
        <H2>Typography</H2>
        <Card>
          <H1>Heading 1 - Main Title</H1>
          <H2>Heading 2 - Section Title</H2>
          <H3>Heading 3 - Subsection Title</H3>
          <p className="text-base text-gray-700 mb-2">
            Body text - Regular paragraph content goes here with standard
            styling.
          </p>
          <p className="text-sm text-gray-600">
            Small text - Used for captions and secondary information.
          </p>
        </Card>
      </section>

      {/* Buttons */}
      <section className="mb-12">
        <H2>Buttons</H2>
        <Card>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </Card>
      </section>

      {/* Badges */}
      <section className="mb-12">
        <H2>Badges</H2>
        <Card>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Completed</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="danger">Cancelled</Badge>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Common use cases: appointment status, test completion, user roles
          </div>
        </Card>
      </section>

      {/* Form Inputs */}
      <section className="mb-12">
        <H2>Form Inputs</H2>
        <Card>
          <div className="space-y-4 max-w-md">
            <FormField label="Text Input">
              <Input placeholder="Enter text here..." />
            </FormField>

            <FormField label="Email Input">
              <Input type="email" placeholder="email@example.com" />
            </FormField>

            <FormField label="Select Dropdown">
              <Select>
                <option>Choose an option...</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </Select>
            </FormField>

            <div>
              <Label>Standalone Label</Label>
              <Input placeholder="Without FormField wrapper" />
            </div>
          </div>
        </Card>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <H2>Cards</H2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Standard Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                A card with header and content sections. Perfect for displaying
                exam information or appointment details.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-accent-lighter border-accent-light">
            <CardHeader>
              <CardTitle>Accent Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                This card uses the mint accent background for emphasis or to
                highlight important information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card with Badge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="success">Active</Badge>
                <Badge variant="primary">Featured</Badge>
              </div>
              <p className="text-gray-700">
                Cards can contain badges, buttons, and other components.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card with Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Example of a card with action buttons at the bottom.
              </p>
              <div className="flex gap-2">
                <Button variant="primary" className="text-sm px-3 py-1">
                  Edit
                </Button>
                <Button variant="ghost" className="text-sm px-3 py-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Alerts */}
      <section className="mb-12">
        <H2>Alerts</H2>
        <div className="space-y-4">
          <Alert variant="info">
            <strong>Info:</strong> This is an informational message.
          </Alert>
          <Alert variant="success">
            <strong>Success!</strong> Your appointment has been scheduled.
          </Alert>
          <Alert variant="warning">
            <strong>Warning:</strong> Please arrive 15 minutes early.
          </Alert>
          <Alert variant="danger">
            <strong>Error:</strong> Unable to process your request.
          </Alert>
        </div>
      </section>

      {/* Modal */}
      <section className="mb-12">
        <H2>Modal</H2>
        <Card>
          <p className="text-gray-700 mb-4">
            Click the button below to see the modal component in action.
          </p>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Open Modal
          </Button>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <ModalHeader onClose={() => setIsModalOpen(false)}>
              Example Modal
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-700 mb-4">
                This is a modal dialog. It can be used for confirmations, forms,
                or displaying detailed information.
              </p>
              <FormField label="Example Input">
                <Input placeholder="Enter something..." />
              </FormField>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Confirm
              </Button>
            </ModalFooter>
          </Modal>
        </Card>
      </section>

      {/* Table */}
      <section className="mb-12">
        <H2>Table</H2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Mathematics Final</TableCell>
                <TableCell>Dec 15, 2024</TableCell>
                <TableCell>9:00 AM</TableCell>
                <TableCell>
                  <Badge variant="success">Scheduled</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>English Midterm</TableCell>
                <TableCell>Dec 18, 2024</TableCell>
                <TableCell>2:00 PM</TableCell>
                <TableCell>
                  <Badge variant="warning">Pending</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>History Quiz</TableCell>
                <TableCell>Dec 10, 2024</TableCell>
                <TableCell>11:00 AM</TableCell>
                <TableCell>
                  <Badge variant="primary">Completed</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Status Colors */}
      <section className="mb-12">
        <H2>Status Colors</H2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-danger-500 text-white text-center">
            Danger
          </div>
          <div className="p-4 rounded-xl bg-warning-500 text-gray-900 text-center">
            Warning
          </div>
          <div className="p-4 rounded-xl bg-success-500 text-white text-center">
            Success
          </div>
          <div className="p-4 rounded-xl bg-info-500 text-white text-center">
            Info
          </div>
        </div>
      </section>

      {/* Container Example with PageHeader, Section, and Grid */}
      <Container>
        <PageHeader
          title="Scheduled Exams"
          description="View and manage upcoming examinations"
          actions={<Button variant="primary">Schedule New Exam</Button>}
        />

        <Section title="Upcoming Exams">
          <Grid cols={3}>
            <Card>
              <h3>Math Final</h3>
              <p>December 15, 2024</p>
            </Card>
            <Card>
              <h3>English Midterm</h3>
              <p>December 18, 2024</p>
            </Card>
            <Card>
              <h3>History Quiz</h3>
              <p>December 20, 2024</p>
            </Card>
          </Grid>
        </Section>

        <Section title="Past Exams">{/* More cards here */}</Section>
      </Container>

      <Container className="mt-12">
        <H2>Glassmorphism Examples</H2>
        {/* Standard card - already has subtle glass */}
        <Card>
          <CardTitle>Exam Schedule</CardTitle>
        </Card>
        {/* Purple-tinted glass card */}
        <Card className="glass-purple">
          <CardTitle>Admin Actions</CardTitle>
        </Card>
        {/* Mint-tinted glass card */}
        <Card className="glass-mint">
          <CardTitle>Active Appointments</CardTitle>
        </Card>
        {/* Strong colored glass for emphasis */}
        <div className="glass-purple-strong p-6 rounded-xl">
          <h3>Important Notice</h3>
          <p>Remember to arrive 15 minutes early</p>
        </div>
        {/* Navbar or modals */}
        <nav className="glass-white">{/* Navigation content */}</nav>
      </Container>

      <Container>
        {/* Main content - standard cards */}
        <Grid cols={3}>
          <Card>Regular exam card</Card>
          <Card>Regular exam card</Card>

          {/* Featured/priority item - colored glass */}
          <Card className="glass-purple-strong">
            <Badge variant="primary">Urgent</Badge>
            <CardTitle>Priority Exam</CardTitle>
          </Card>
        </Grid>

        {/* Info panel - mint glass */}
        <div className="glass-mint p-4 rounded-lg mt-6">
          <p>Today's appointments: 12 scheduled</p>
        </div>
      </Container>
    </div>
  );
}
